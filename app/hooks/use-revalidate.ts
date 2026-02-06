import { useTransition } from "react";

import {
  revalidateMultiplePaths,
  revalidateMultipleTags,
  revalidatePathAction,
  revalidateTagAction,
} from "@/lib/revalidate";

export function useRevalidate() {
  const [isPending, startTransition] = useTransition();

  const revalidateTag = (tag: string) => {
    startTransition(async () => {
      await revalidateTagAction(tag);
    });
  };

  const revalidatePath = (path: string, type?: "page" | "layout") => {
    startTransition(async () => {
      await revalidatePathAction(path, type);
    });
  };

  const revalidateTags = (tags: string[]) => {
    startTransition(async () => {
      await revalidateMultipleTags(tags);
    });
  };

  const revalidatePaths = (
    paths: Array<{ path: string; type?: "page" | "layout" }>
  ) => {
    startTransition(async () => {
      await revalidateMultiplePaths(paths);
    });
  };

  return {
    revalidateTag,
    revalidatePath,
    revalidateTags,
    revalidatePaths,
    isPending,
  };
}
