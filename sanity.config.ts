import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { postType } from "./sanity/schemaTypes/postType";
import { authorType } from "./sanity/schemaTypes/authorType";
import { blockContentType } from "./sanity/schemaTypes/blockContentType";
import { categoryType } from "./sanity/schemaTypes/categoryType";
import { commentType } from "./sanity/schemaTypes/commentType";

export default defineConfig({
  name: "default",
  title: "TechSuperStar",

  projectId: "ba3aow7c",
  dataset: "production",

  basePath: "/studio",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [postType, authorType, blockContentType, categoryType, commentType],
  },
});