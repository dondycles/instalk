"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const UUID = z.string().uuid();

export default async function unlikePost(
  postId: z.infer<typeof UUID>,
  userUUID: z.infer<typeof UUID>
) {
  const supabase = createClient();
  const { error } = await supabase.from("posts_likes").delete().match({
    post: postId,
    user: userUUID,
  });

  if (error) return { error: error };
  return { success: "Posted!" };
}
