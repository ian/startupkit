import path from "path";

export const extractRoute = (filePath: string): string | null => {
  const dir = path.dirname(filePath); // Get the directory name
  const fileName = path.basename(filePath, path.extname(filePath)); // Get the file name without extension
  const match = dir.match(/\/pages(\/.*)/); // Match the path segment
  return match ? `${match[1]}/${fileName}` : null; // Return the matched route with the file name
};
