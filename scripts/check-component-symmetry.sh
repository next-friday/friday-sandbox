#!/usr/bin/env bash
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

strip_comments() { perl -0pe 's{/\*.*?\*/}{}gs; s{(?<!:)//.*}{}g' "$1"; }

classes_from() { strip_comments "$1" | grep -oE "fri-$2(-[a-z0-9]+)*([^a-z0-9-]|$)" | grep -oE "fri-$2(-[a-z0-9]+)*" | sort -u; }

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

react_names=$(find "$REACT_BASES" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null || true)
css_names=$(find "$STYLES_COMPONENTS" -maxdepth 1 -name "*.css" ! -name "index.css" -exec basename {} .css \; 2>/dev/null || true)
components=$(printf "%s\n%s\n" "$react_names" "$css_names" | grep -v '^$' | sort -u)

checked=0
for name in $components; do
  dir="$REACT_BASES/$name"
  variants="$dir/$name.styles.ts"
  stories="$dir/$name.stories.tsx"
  css="$STYLES_COMPONENTS/$name.css"

  missing=0
  for pair in "component:$dir/$name.tsx" "variants:$variants" "index:$dir/index.ts" "stories:$stories" "css:$css"; do
    label="${pair%%:*}"; path="${pair#*:}"
    [ -f "$path" ] || { fail "$name" "missing $label surface $path"; missing=1; }
  done
  [ "$missing" -eq 1 ] && continue
  checked=$((checked + 1))
  Pascal=$(pascal "$name")

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

  echo "$bases_index" | grep -qE "\b$Pascal\b" || fail "$name" "$Pascal not exported from bases/index.ts"
  echo "$react_index" | grep -qE "\b$Pascal\b" || fail "$name" "$Pascal not exported from src/index.ts"
  echo "$styles_index" | grep -qF "./$name.css" || fail "$name" "$name.css not @import'd in components/index.css"

  axes=$(object_keys "$variants" "variants")
  controls=$(object_keys "$stories" "argTypes")
  for axis in $axes; do
    echo "$controls" | grep -qx "$axis" || fail "$name" "variant axis \"$axis\" has no argTypes control in $name.stories.tsx"
  done

  grep -qE "export const Default\b" "$stories" || fail "$name" "$name.stories.tsx has no Default story"

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

defined=$(grep -rhoE "^[[:space:]]*--fri-[a-z0-9-]+:" "$STYLES_THEMES" | tr -d ' :' | sort -u)
used=$(grep -rhoE "var\(--fri-[a-z0-9-]+" "$STYLES_SRC" 2>/dev/null | sed -E 's/.*var\((--fri[a-z0-9-]+).*/\1/' | sort -u)
for ref in $(comm -23 <(echo "$used") <(echo "$defined")); do
  fail "tokens" "var($ref) referenced but never defined in themes/ (dangling — renamed or typo'd token)"
done
theme_css="$STYLES_SRC/tailwind/theme.css"
for u in $(grep -rhoE "@apply[^;]*" "$STYLES_COMPONENTS"/*.css | grep -oE "\b(gap|text-display|text-body|text-label)-(xxsmall|xsmall|small|medium|large|xlarge|2xlarge|3xlarge|4xlarge)(-strong)?\b" | sort -u); do
  case "$u" in
    gap-*) key="--spacing-${u#gap-}" ;;
    text-*) key="--text-${u#text-}" ;;
  esac
  grep -qF -- "$key:" "$theme_css" || fail "tokens" "utility \"$u\" has no @theme entry ($key) in tailwind/theme.css"
done

tw_theme=$(find node_modules/.pnpm -path "*/tailwindcss/theme.css" 2>/dev/null | head -1)
if [ -n "$tw_theme" ]; then
  ours=$(grep -hoE "^[[:space:]]*--[a-z0-9-]+:" "$theme_css" | tr -d ' :' | sort -u)
  tw=$(grep -hoE "^[[:space:]]*--[a-z0-9-]+:" "$tw_theme" | tr -d ' :' | sort -u)
  for name in $(comm -12 <(echo "$ours") <(echo "$tw")); do
    case "$name" in
      --font-sans | --font-mono) ;;
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

div_hits=$(grep -rn "<div" "$REACT_BASES"/*/*.stories.tsx "$DOCS"/*.mdx 2>/dev/null | grep -v '`<div' | cut -d: -f1-2)
for hit in $div_hits; do
  fail "div" "raw <div> at $hit — lay out with <Flex>/<Grid> and use samples for placeholders, never a raw <div>"
done

html_hits=$(grep -rnE "<(span|p|h[1-6]|button)\b" "$DOCS"/*.mdx 2>/dev/null | grep -vE '`<(span|p|h[1-6]|button)' | cut -d: -f1-2)
for hit in $html_hits; do
  fail "html" "raw HTML at $hit — use <Text> for text/headings, <Button> for a button, <Lorem> for placeholder copy; never a bare <span>/<p>/<h*>/<button>"
done

for f in "$STYLES_SRC/layers/base.css" "$STYLES_COMPONENTS"/*.css; do
  [ -f "$f" ] || continue
  while IFS= read -r line; do
    [ -n "$line" ] && fail "apply" "${f##*/}: raw CSS property — use @apply, or wrap a no-utility property as a @utility in layers/utilities.css ($line)"
  done < <(grep -nE "^[[:space:]]+[a-z][a-zA-Z-]*[[:space:]]*:" "$f" | grep -vE "\{[[:space:]]*$")
done

[ ${#warns[@]} -gt 0 ] && printf "\nsymmetry warnings:\n%s\n" "$(printf '%s\n' "${warns[@]}")"
if [ ${#fails[@]} -gt 0 ]; then
  printf "\ncomponent symmetry FAILED across %d components:\n%s\n" "$checked" "$(printf '%s\n' "${fails[@]}")" >&2
  exit 1
fi
note=""; [ ${#warns[@]} -gt 0 ] && note=", ${#warns[@]} warning(s)"
echo "✓ component symmetry: $checked components verified across presence, variants↔css, barrels, controls, stories, docs, token resolution, theme invariants, no-raw-html, apply-only$note"
