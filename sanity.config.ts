import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { postType } from "./sanity/schemaTypes/postType";

export default defineConfig({
  name: "default",
  title: "TechSuperStar",

  projectId: "ba3aow7c",
  dataset: "production",

  basePath: "/studio",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      {
        name: "comment",
        title: "Comment",
        type: "document",
        fields: [
          { name: "name", title: "Name", type: "string" },
          { name: "email", title: "Email", type: "string" },
          { name: "message", title: "Message", type: "text" },
          { name: "approved", title: "Approved", type: "boolean" },
          { name: "post", title: "Post", type: "reference", to: [{ type: "post" }] },
          { name: "createdAt", title: "Created At", type: "datetime" },
        ],
      },
      {
        name: "category",
        title: "Category",
        type: "document",
        fields: [
          { name: "title", title: "Title", type: "string" },
          { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
          { name: "description", title: "Description", type: "text" },
        ],
      },
      postType, // ✅ uses postType.ts which has specs, pros, cons
    ],
  },
});