import { loader } from "fumadocs-core/source";

import { documentation } from "@/.source/server";

export const source = loader({
  baseUrl: "/docs",
  source: documentation.toFumadocsSource(),
});
