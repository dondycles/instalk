"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const postUUID = z.string().uuid();

export default async function likePost(postId: z.infer<typeof postUUID>) {
  const supabase = createClient();
  const { error } = await supabase.from("posts_likes").insert({
    post: postId,
  });
  if (error) return { error: error };
  return { success: "Posted!" };
}
