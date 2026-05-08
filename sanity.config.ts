import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { YoutubeAutofill } from "./sanity/components/YoutubeAutofill";

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
      {
        name: "post",
        title: "Post",
        type: "document",
        fields: [
          { name: "title", title: "Title", type: "string" },
          { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
          { name: "author", title: "Author", type: "string" },
          { name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } },
          {
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: [{ type: "category" }] }],
          },
          { name: "publishedAt", title: "Published At", type: "datetime" },
          { name: "excerpt", title: "Excerpt", type: "text", description: "Short summary shown under the article title on cards (1-2 sentences)." },
          {
            name: "youtubeUrl",
            title: "YouTube Video URL",
            type: "string",
            description: "Paste YouTube URL then click Auto-fill to extract title, slug, body and date automatically.",
            components: {
              input: YoutubeAutofill,
            },
          },
          {
            name: "body",
            title: "Body",
            type: "array",
            of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
          },
        ],
      },
    ],
  },
});