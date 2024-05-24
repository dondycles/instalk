"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, users(*), posts_likes(user, users(fullname, username))")
    .order("created_at", {
      ascending: false,
    });
  if (error) return { error };
  return { data };
}
