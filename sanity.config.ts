import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

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
        name: "category",
        title: "Category",
        type: "document",
        fields: [
          { name: "title", title: "Title", type: "string" },
          { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
          { name: "description", title: "Description", type: "text" },
        ],
      },
      {
        name: "post",
        title: "Post",
        type: "document",
        fields: [
          { name: "title", title: "Title", type: "string" },
          { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
          { name: "author", title: "Author", type: "string" },
          { name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } },
          { name: "categories", title: "Categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] },
          { name: "publishedAt", title: "Published At", type: "datetime" },
          {
            name: "youtubeUrl",
            title: "YouTube Video URL",
            type: "url",
            description: "Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=xxxxx). Video will appear at the top of the article.",
          },
          { name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] },
        ],
      },
    ],
  },
});