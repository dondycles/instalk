"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const postUUID = z.string().uuid();
const userUUID = z.string().uuid();

export default async function unlikePost(
  postId: z.infer<typeof postUUID>,
  userUUID: z.infer<typeof postUUID>
) {
  const supabase = createClient();
  const { error } = await supabase.from("posts_likes").delete().match({
    post: postId,
    user: userUUID,
  });

  console.log(error);

  if (error) return { error: error };
  return { success: "Posted!" };
}
