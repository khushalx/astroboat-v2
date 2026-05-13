import { articles } from "@/lib/mock-data";
import type { Article } from "@/lib/types";

export async function getArticles(): Promise<Article[]> {
  return articles;
}

export async function getFeaturedArticle(): Promise<Article> {
  return articles.find((article) => article.featured) ?? articles[0];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articles.find((article) => article.slug === slug);
}
