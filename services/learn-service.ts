import { learningPaths } from "@/lib/mock-data";
import type { LearningPath } from "@/lib/types";

export async function getLearningPaths(): Promise<LearningPath[]> {
  return learningPaths;
}
