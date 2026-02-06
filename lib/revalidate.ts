"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateTagAction(tag: string) {
  revalidateTag(tag, "max");
}

export async function revalidatePathAction(
  path: string,
  type?: "page" | "layout"
) {
  revalidatePath(path, type);
}

export async function revalidateMultipleTags(tags: string[]) {
  tags.forEach((tag) => revalidateTag(tag, "max"));
}

export async function revalidateMultiplePaths(
  paths: Array<{ path: string; type?: "page" | "layout" }>
) {
  paths.forEach(({ path, type }) => revalidatePath(path, type));
}
