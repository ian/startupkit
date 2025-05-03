import Link from "next/link";
import { readStatic, type Meta } from "@startupkit/cms";
import Head from "next/head";

export default function BlogPage({ posts }: { posts: Meta[] }) {
  return (
    <div className="py-24 sm:py-32">
      <Head>
        <title>Blog | StartupKit</title>
        <meta
          name="description"
          content="Discover practical advice, industry trends, and actionable strategies for startup success."
        />
        <link rel="canonical" href="https://startupkit.com/blog" />
      </Head>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-300">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post: Meta) => (
            <Link
              key={post.id}
              href={post.href}
              className="group flex flex-col items-start justify-between hover:scale-101 transition-all duration-150"
            >
              <div className="relative w-full">
                <img
                  alt=""
                  src={post.imageUrl}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="">
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-700 text-white px-3 py-1.5 font-medium text-3ray-600">
                    {post.category}
                  </span>
                </div>
                <div className="relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-300 group-hover:text-white transition-all duration-250">
                    <span className="absolute inset-0" />
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-300 group-hover:text-white transition-all duration-250">
                    {post.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await readStatic(process.cwd() + "/src/pages/blog");
  return {
    props: {
      posts,
    },
  };
}
