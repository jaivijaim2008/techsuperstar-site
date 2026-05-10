import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getPost, getRelatedPosts } from "@/lib/query";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ShareButtons, ReadingProgressBar, TableOfContents, CommentsSection } from "./ClientComponents";
import { notFound } from "next/navigation";


interface Spec { label: string; value: string }

interface Post {
  _id: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  author: string;
  image: string;
  categories: string[];
  publishedAt: string;
  youtubeUrl?: string;
  body: unknown[];
  excerpt: string;
  specs?: Spec[];
  pros?: string[];
  cons?: string[];
  comments: Comment[];
}

interface Comment {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

const ptComponents = {
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-2xl sm:text-3xl font-black mt-8 mb-4 text-white leading-tight">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = typeof children === "string" ? children :
        Array.isArray(children) ? children.join("") : "";
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return (
        <h2 id={id} className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 text-white border-l-4 border-orange-500 pl-4 scroll-mt-20">{children}</h2>
      );
    },
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg sm:text-xl font-bold mt-5 mb-2 text-orange-400">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-base sm:text-lg font-semibold mt-4 mb-2 text-gray-200">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-300 leading-relaxed mb-4 text-base sm:text-[1.05rem]">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-orange-500 pl-4 sm:pl-6 py-2 my-5 bg-orange-500/5 rounded-r-lg italic text-gray-300 text-sm sm:text-base">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-none space-y-2 my-4 pl-1">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
        <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-orange-300">{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer"
        className="text-orange-400 underline underline-offset-2 hover:text-orange-300 transition-colors">
        {children}
      </a>
    ),
  },
};

function SpecsTable({ specs }: { specs: Spec[] }) {
  if (!specs?.length) return null;
  return (
    <div className="my-8 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-orange-500/20 to-transparent border-b border-white/10 flex items-center gap-3">
        <span className="text-xl">📋</span>
        <h3 className="text-base sm:text-lg font-bold text-white">Full Specifications</h3>
      </div>
      <div className="divide-y divide-white/5">
        {specs.map((spec, i) => (
          <div key={i} className="flex items-start sm:items-center px-4 sm:px-6 py-3 hover:bg-white/5 transition-colors gap-3">
            <span className="w-28 sm:w-36 text-xs sm:text-sm font-semibold text-orange-400 flex-shrink-0 pt-0.5 sm:pt-0">{spec.label}</span>
            <span className="text-gray-200 text-xs sm:text-sm">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProsAndCons({ pros, cons }: { pros?: string[]; cons?: string[] }) {
  if (!pros?.length && !cons?.length) return null;
  return (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pros?.length ? (
        <div className="rounded-xl sm:rounded-2xl border border-green-500/20 bg-green-500/5 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2">
            <span className="text-green-400">✅</span>
            <h3 className="font-bold text-green-400 text-xs sm:text-sm uppercase tracking-widest">Pros</h3>
          </div>
          <ul className="px-4 sm:px-5 py-4 space-y-2.5">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-200 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {cons?.length ? (
        <div className="rounded-xl sm:rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
            <span className="text-red-400">❌</span>
            <h3 className="font-bold text-red-400 text-xs sm:text-sm uppercase tracking-widest">Cons</h3>
          </div>
          <ul className="px-4 sm:px-5 py-4 space-y-2.5">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-200 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.image;
  return {
    title: title.includes("TechSuperStar") ? title : `${title} | TechSuperStar`,
    description,
    openGraph: {
      title, description,
      url: `https://techsuperstar-site.vercel.app/post/${slug}`,
      siteName: "TechSuperStar",
      images: image ? [{ url: `${image}?w=600&q=80`, width: 600, height: 315 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      creator: "@Tech_SuperStar",
      images: image ? [`${image}?w=600&q=80`] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post | null = await getPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.categories || []);
  const embedUrl = post.youtubeUrl ? getYouTubeEmbedUrl(post.youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <ReadingProgressBar />
      <Navbar />

      <div className="relative">
        {post.image && (
          <div className="absolute inset-0 h-[320px] sm:h-[520px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#060606]" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 pt-16 sm:pt-32 pb-8 sm:pb-12">
          {post.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.categories.map((cat) => (
                <Link key={cat} href={`/category/${cat.toLowerCase()}`}
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 sm:mb-6 text-white drop-shadow-lg">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                {post.author?.[0] || "T"}
              </span>
              <span className="text-gray-300 font-medium text-sm">{post.author || "TechSuperStar"}</span>
            </span>
            {post.publishedAt && <span className="text-xs sm:text-sm">{formatDate(post.publishedAt)}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 sm:pb-20">
        <ScrollReveal>
          {embedUrl && (
            <div className="mb-6 sm:mb-10 rounded-xl sm:rounded-2xl overflow-hidden aspect-video shadow-2xl shadow-orange-500/10 border border-white/10">
              <iframe src={embedUrl} className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title={post.title} />
            </div>
          )}
          {post.excerpt && (
            <div className="mb-6 sm:mb-8 px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-gray-200 text-base sm:text-lg leading-relaxed italic">{post.excerpt}</p>
            </div>
          )}
          <TableOfContents body={post.body as never[]} />
          <article className="prose max-w-none">
            {post.body && (
              <PortableText
                value={post.body as Parameters<typeof PortableText>[0]["value"]}
                components={ptComponents}
              />
            )}
          </article>
          {post.specs?.length ? <SpecsTable specs={post.specs} /> : null}
          {(post.pros?.length || post.cons?.length) ? (
            <ProsAndCons pros={post.pros} cons={post.cons} />
          ) : null}

          {/* Native Banner */}
          <AdsterraAd
            nativeSrc="https://pl29406987.profitablecpmratenetwork.com/dc833c55a3fdef945b15de662ae71a41/invoke.js"
            nativeId="container-dc833c55a3fdef945b15de662ae71a41"
          />

          {/* Banner 300x250 */}
          <AdsterraAd adKey="932242fddbeb385eb603aa51cd39fb8a" width={300} height={250} />

          {/* Banner 728x90 */}
          <AdsterraAd adKey="fb89288aebe3488559b878b5acfb5a87" width={728} height={90} />

          <ShareButtons title={post.title} slug={slug} />
        </ScrollReveal>

        {relatedPosts.length > 0 && (
          <section className="mt-14 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 text-white">
              Related <span className="text-orange-500">Posts</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {relatedPosts.map((rp: { slug: { current: string }; image?: string; title: string; categories?: string[]; publishedAt?: string }) => (
                <Link key={rp.slug.current} href={`/post/${rp.slug.current}`}
                  className="group rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-white/10 transition-all duration-300">
                  {rp.image && (
                    <div className="overflow-hidden aspect-video">
                      <img src={rp.image} alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    {rp.categories?.[0] && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                        {rp.categories[0]}
                      </span>
                    )}
                    <h3 className="mt-1 font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {rp.title}
                    </h3>
                    {rp.publishedAt && (
                      <p className="mt-1.5 text-xs text-gray-500">{formatDate(rp.publishedAt)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Banner 160x600 */}
        <AdsterraAd adKey="7a9bb5ef7a553be41bb24fdd3734233d" width={160} height={600} />

        <CommentsSection postId={post._id} initialComments={post.comments || []} />
      </div>

      <Footer />
    </div>
  );
}