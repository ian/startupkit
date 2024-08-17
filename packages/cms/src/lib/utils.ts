import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Meta = {
  href: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  lastUpdated: string;
  category: string;
  author: { name: string; role: string; imageUrl: string };
} & {
  [key: string]: string;
};

export const readStatic = (dir: string): Array<Meta> => {
  const postsDirectory = path.join(dir);
  const records = fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        href: `/blog/${filename.replace(/\.mdx$/, "")}`,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || data.ogImage,
        date: new Date(data.date).toISOString(), // Convert to ISO string
        lastUpdated: new Date(data.date).toISOString(), // Convert to ISO string
        category: data.category,
        author: {
          name: data.author,
          role: "Author",
          // imageUrl: data.ogImage,
        },
      } as Meta;
    });

  records.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return records;
};
