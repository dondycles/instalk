"use server";

import { createClient } from "@/utils/supabase/server";
import { postSchema } from "../(user)/feed/post-form";
import { z } from "zod";

export default async function postPost(postData: z.infer<typeof postSchema>) {
  const supabase = createClient();
  const { error } = await supabase.from("posts").insert({
    content: postData.content,
    privacy: postData.privacy,
  });

  if (error) return { error: error };
  return { success: "Posted!" };
}
