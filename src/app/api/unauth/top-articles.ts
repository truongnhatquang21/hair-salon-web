import type IArticle from "@/types/article";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_TOP_ARTICLES;
export const getAllTopArticles = async (): Promise<IArticle[]> => {
  const res = await fetch(`${baseUrl}`, { cache: "no-store" });
  const articles = await res.json();
  return articles;
};
