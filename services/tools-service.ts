import { toolCards } from "@/lib/mock-data";
import type { ToolCard } from "@/lib/types";

export async function getToolCards(): Promise<ToolCard[]> {
  return toolCards;
}
