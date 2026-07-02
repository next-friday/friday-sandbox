#!/usr/bin/env bash
# Machine-checks symmetry across every base component, in every dimension a tool can
# verify deterministically — so the regularity the templates promise is proven, not
# trusted, and an LLM filling a component cannot quietly drift from the pattern.
# Dimensions:
#   1. presence         — every surface exists (.tsx, index.ts, .stories.tsx; .styles.ts, .css)
#   2. variants <-> css — every fri-<name>-<value> class mirrors 1:1, none duplicated
#   3. barrels          — exported through all three react barrels + the styles @import
#   4. axis <-> control — every variant axis has a Storybook argType
#   5. story floor       — a Default story exists
#   6. doc spine + props — the doc page (when present) carries the required sections in order,
#                          Accessibility last, and a Props row for every variant axis
#   7. token resolution — every var(--fri-*) resolves to a definition, and every full-word
#                          scale utility in @apply resolves to a @theme entry (repo-wide, not
#                          per-component: catches a renamed token whose ref was missed)
#   8. theme invariants  — the @theme bridge adds new names only (never overrides a Tailwind
#                          theme var, save --font-*), and token scale suffixes stay spelled in
#                          full (no re-introduced xs/sm/md that would collide once mapped)
#   9. no raw html       — stories + docs lay out with <Flex>/<Grid> and samples; docs also
#                          dogfood <Text>/<Button>; a raw <div>/<span>/<p>/<button> fails
# FAIL = a hard asymmetry that breaks the contract. WARN = a soft gap (a missing doc page).
#
# Shell, not TypeScript: the checks are regex over the literal conventions (grep/awk over the
# string names the generator owns), not a TS/CSS AST — so a shell script with no toolchain to
# typecheck is the honest form. Upgrade to a real AST walk only if a name is ever computed.
#
# Run: bash scripts/check-component-symmetry.sh
# No `set -e`: this gate runs many grep/comm probes whose "no match" (exit 1) is a normal,
# expected outcome — it collects every failure into an array and reports them at the end, so an
# early exit on a benign non-zero would hide real findings. `-u`/`pipefail` still catch bugs.
set -uo pipefail

REACT_BASES="packages/react/src/components/bases"
STYLES_SRC="packages/styles/src"
STYLES_COMPONENTS="$STYLES_SRC/components"
STYLES_THEMES="$STYLES_SRC/themes"
DOCS="apps/docs/content/docs/components"

REACT_INDEX="packages/react/src/index.ts"
BASES_INDEX="$REACT_BASES/index.ts"
STYLES_INDEX="$STYLES_COMPONENTS/index.css"

REQUIRED_DOC_SECTIONS=("Import" "Usage" "Purpose" "When to use" "When not to use")
LAST_DOC_SECTION="Accessibility"

fails=()
warns=()
fail() { fails+=("  ✗ $1: $2"); }
warn() { warns+=("  ⚠ $1: $2"); }

pascal() { echo "$1" | awk -F- '{ for (i=1;i<=NF;i++) printf "%s%s", toupper(substr($i,1,1)), substr($i,2); print "" }'; }

# Strip /* */ and // comments so a class merely named in prose isn't counted as declared.
strip_comments() { perl -0pe 's{/\*.*?\*/}{}gs; s{(?<!:)//.*}{}g' "$1"; }

# Every fri-<name> / fri-<name>-<value> token with a trailing boundary, comments stripped.
classes_from() { strip_comments "$1" | grep -oE "fri-$2(-[a-z0-9]+)*([^a-z0-9-]|$)" | grep -oE "fri-$2(-[a-z0-9]+)*" | sort -u; }

# Keys directly inside the first `<block>: { ... }`, by brace-depth scan (awk).
object_keys() {
  strip_comments "$1" | awk -v block="$2" '
    BEGIN { depth = 0; started = 0 }
    {
      line = $0
      if (!started) { if (index(line, block ": {")) { started = 1; sub(/.*\{/, "{", line) } else next }
      n = split(line, ch, "")
      for (i = 1; i <= n; i++) {
        c = ch[i]
        if (c == "{") depth++
        else if (c == "}") { depth--; if (depth == 0) exit }
      }
      if (started && depth == 1) {
        s = line; sub(/^[[:space:]]*/, "", s)
        if (match(s, /^[A-Za-z_$][A-Za-z0-9_$]*[[:space:]]*:/)) {
          k = substr(s, 1, RLENGTH); sub(/[[:space:]]*:$/, "", k); print k
        }
        if (match(s, /^"[^"]+"[[:space:]]*:/)) {
          k = substr(s, 1, RLENGTH); sub(/[[:space:]]*:$/, "", k); gsub(/"/, "", k); print k
        }
      }
    }
  ' | sort -u
}

react_index=$(cat "$REACT_INDEX" 2>/dev/null || true)
bases_index=$(cat "$BASES_INDEX" 2>/dev/null || true)
styles_index=$(cat "$STYLES_INDEX" 2>/dev/null || true)

# Component set from BOTH trees so a half-generated component fails loudly.
react_names=$(find "$REACT_BASES" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null || true)
css_names=$(find "$STYLES_COMPONENTS" -maxdepth 1 -name "*.css" ! -name "index.css" -exec basename {} .css \; 2>/dev/null || true)
components=$(printf "%s\n%s\n" "$react_names" "$css_names" | grep -v '^$' | sort -u)

checked=0
for name in $components; do
  dir="$REACT_BASES/$name"
  variants="$dir/$name.styles.ts"
  stories="$dir/$name.stories.tsx"
  css="$STYLES_COMPONENTS/$name.css"

  # 1. Presence.
  missing=0
  for pair in "component:$dir/$name.tsx" "variants:$variants" "index:$dir/index.ts" "stories:$stories" "css:$css"; do
    label="${pair%%:*}"; path="${pair#*:}"
    [ -f "$path" ] || { fail "$name" "missing $label surface $path"; missing=1; }
  done
  [ "$missing" -eq 1 ] && continue
  checked=$((checked + 1))
  Pascal=$(pascal "$name")

  # 2. variants <-> css mirror.
  declared=$(classes_from "$variants" "$name")
  dup=$(echo "$declared" | grep -v '^$' | sort | uniq -d || true)
  [ -n "$dup" ] && for c in $dup; do fail "$name" "duplicate class \"$c\" in variants — every value must be distinct"; done
  css_classes=$(classes_from "$css" "$name")
  for c in $(comm -23 <(echo "$declared" | grep -v '^$') <(echo "$css_classes" | grep -v '^$')); do
    fail "$name" "\"$c\" in variants has no rule in $name.css (orphan variant)"
  done
  for c in $(comm -13 <(echo "$declared" | grep -v '^$') <(echo "$css_classes" | grep -v '^$')); do
    fail "$name" "\".$c\" in $name.css has no variant in $name.styles.ts (orphan css)"
  done

  # 3. Barrels.
  echo "$bases_index" | grep -qE "\b$Pascal\b" || fail "$name" "$Pascal not exported from bases/index.ts"
  echo "$react_index" | grep -qE "\b$Pascal\b" || fail "$name" "$Pascal not exported from src/index.ts"
  echo "$styles_index" | grep -qF "./$name.css" || fail "$name" "$name.css not @import'd in components/index.css"

  # 4. axis <-> control.
  axes=$(object_keys "$variants" "variants")
  controls=$(object_keys "$stories" "argTypes")
  for axis in $axes; do
    echo "$controls" | grep -qx "$axis" || fail "$name" "variant axis \"$axis\" has no argTypes control in $name.stories.tsx"
  done

  # 5. Story floor.
  grep -qE "export const Default\b" "$stories" || fail "$name" "$name.stories.tsx has no Default story"

  # 6. Doc spine.
  doc="$DOCS/$name.mdx"
  if [ ! -f "$doc" ]; then warn "$name" "no doc page $name.mdx"; continue; fi
  sections=$(grep -oE "^##[[:space:]]+.+" "$doc" | sed -E 's/^##[[:space:]]+//; s/[[:space:]]*$//')
  prev=-1
  for required in "${REQUIRED_DOC_SECTIONS[@]}"; do
    at=$(echo "$sections" | grep -nxF "$required" | head -1 | cut -d: -f1 || true)
    if [ -z "$at" ]; then fail "$name" "doc is missing the \"$required\" section"; continue; fi
    [ "$at" -lt "$prev" ] && fail "$name" "doc section \"$required\" is out of order — keep the spine order"
    prev="$at"
  done
  last=$(echo "$sections" | grep -v '^$' | tail -1)
  [ "$last" = "$LAST_DOC_SECTION" ] || fail "$name" "doc's last section must be \"$LAST_DOC_SECTION\", found \"${last:-none}\""
  for axis in $axes; do
    grep -qE "\|[[:space:]]*\`$axis\`" "$doc" || fail "$name" "variant axis \"$axis\" has no row in the doc Props table"
  done
done

# 7. Token resolution (repo-wide) — every var(--fri-*) resolves to a definition, and every
# full-word scale utility in @apply resolves to a @theme entry. Catches a renamed token whose
# reference was missed in a calc()/@apply that a per-component mirror check never inspects.
defined=$(grep -rhoE "^[[:space:]]*--fri-[a-z0-9-]+:" "$STYLES_THEMES" | tr -d ' :' | sort -u)
used=$(grep -rhoE "var\(--fri-[a-z0-9-]+" "$STYLES_SRC" 2>/dev/null | sed -E 's/.*var\((--fri[a-z0-9-]+).*/\1/' | sort -u)
for ref in $(comm -23 <(echo "$used") <(echo "$defined")); do
  fail "tokens" "var($ref) referenced but never defined in themes/ (dangling — renamed or typo'd token)"
done
# @theme namespace parity: every full-word scale utility used in @apply has a --<ns>-* entry.
theme_css="$STYLES_SRC/tailwind/theme.css"
for u in $(grep -rhoE "@apply[^;]*" "$STYLES_COMPONENTS"/*.css | grep -oE "\b(gap|text-display|text-body|text-label)-(xxsmall|xsmall|small|medium|large|xlarge|2xlarge|3xlarge|4xlarge)(-strong)?\b" | sort -u); do
  case "$u" in
    gap-*) key="--spacing-${u#gap-}" ;;
    text-*) key="--text-${u#text-}" ;;
  esac
  grep -qF -- "$key:" "$theme_css" || fail "tokens" "utility \"$u\" has no @theme entry ($key) in tailwind/theme.css"
done

# 8. Theme invariants — the two rules this session kept breaking by hand:
#   8a. the @theme bridge adds NEW names only — it must not redefine a Tailwind theme variable
#       (that silently steals the consumer's native utility), save the --font-* exception.
#   8b. token scale suffixes are spelled in full — a re-introduced abbreviation (xs/sm/md…)
#       collides with Tailwind's own scale the moment it is mapped.
tw_theme=$(find node_modules/.pnpm -path "*/tailwindcss/theme.css" 2>/dev/null | head -1)
if [ -n "$tw_theme" ]; then
  ours=$(grep -hoE "^[[:space:]]*--[a-z0-9-]+:" "$theme_css" | tr -d ' :' | sort -u)
  tw=$(grep -hoE "^[[:space:]]*--[a-z0-9-]+:" "$tw_theme" | tr -d ' :' | sort -u)
  for name in $(comm -12 <(echo "$ours") <(echo "$tw")); do
    case "$name" in
      --font-sans | --font-mono) ;; # deliberate override — the theme font is a first-class knob
      *) fail "tokens" "@theme redefines Tailwind's \"$name\" — add a new name, don't override (breaks the consumer's native utility)" ;;
    esac
  done
else
  warn "tokens" "tailwindcss theme.css not found — skipped @theme override check"
fi
abbr=$(grep -rhoE "^[[:space:]]*--fri-[a-z0-9-]*-(2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|xxl):" "$STYLES_THEMES" | tr -d ' :' | sort -u)
for t in $abbr; do
  fail "tokens" "token \"$t\" uses an abbreviated scale suffix — spell it in full (small/medium/…) so it never collides with Tailwind"
done

# 9. No raw HTML in stories or component docs — LLM contributors reflexively reach for
# bare elements. Stories and doc previews lay out with <Flex>/<Grid> and use the samples
# (<Boxes>, <Lorem>, …) for placeholder content; docs also dogfood <Text> for text and
# headings and <Button> for buttons. The <div> check spans stories + docs; the stricter
# <span>/<p>/<h*>/<button> check is docs-only (stories use <span data-testid> probes).
# Prose that mentions a tag in backticks is exempt (it documents, it doesn't render).
div_hits=$(grep -rn "<div" "$REACT_BASES"/*/*.stories.tsx "$DOCS"/*.mdx 2>/dev/null | grep -v '`<div' | cut -d: -f1-2)
for hit in $div_hits; do
  fail "div" "raw <div> at $hit — lay out with <Flex>/<Grid> and use samples for placeholders, never a raw <div>"
done

# Raw HTML text/interactive elements in component docs — a demo must dogfood the
# design system: text and headings are <Text> (with `as`), a button is <Button>,
# placeholder copy is <Lorem>. Docs-only: stories legitimately use <span data-testid>
# probes. Prose that mentions a tag in backticks (`<span>`) is exempt.
html_hits=$(grep -rnE "<(span|p|h[1-6]|button)\b" "$DOCS"/*.mdx 2>/dev/null | grep -vE '`<(span|p|h[1-6]|button)' | cut -d: -f1-2)
for hit in $html_hits; do
  fail "html" "raw HTML at $hit — use <Text> for text/headings, <Button> for a button, <Lorem> for placeholder copy; never a bare <span>/<p>/<h*>/<button>"
done

[ ${#warns[@]} -gt 0 ] && printf "\nsymmetry warnings:\n%s\n" "$(printf '%s\n' "${warns[@]}")"
if [ ${#fails[@]} -gt 0 ]; then
  printf "\ncomponent symmetry FAILED across %d components:\n%s\n" "$checked" "$(printf '%s\n' "${fails[@]}")" >&2
  exit 1
fi
note=""; [ ${#warns[@]} -gt 0 ] && note=", ${#warns[@]} warning(s)"
echo "✓ component symmetry: $checked components verified across presence, variants↔css, barrels, controls, stories, docs, token resolution, theme invariants, no-raw-html$note"
