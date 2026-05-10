import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { YoutubeAutofill } from "../components/YoutubeAutofill";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown under the article title on cards (1-2 sentences).",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube Video URL",
      type: "string",
      description: "Paste the full YouTube URL then click ⚡ Auto-fill to extract everything automatically.",
      components: {
        input: YoutubeAutofill,
      },
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description: "Auto-filled by AI from video transcript. Edit if needed.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Spec Name" }),
            defineField({ name: "value", type: "string", title: "Spec Value" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      description: "Auto-filled by AI. Each item is one pro point.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      description: "Auto-filled by AI. Each item is one con point.",
      of: [defineArrayMember({ type: "string" })],
    }),
    // ── SEO ──
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Title shown in Google search (50-60 chars). Leave blank to use post title.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Description shown in Google search (150-160 chars). Leave blank to use excerpt.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});