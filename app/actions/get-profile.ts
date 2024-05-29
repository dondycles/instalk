"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const UUID = z.string().uuid();

export default async function getProfile(userId: z.infer<typeof UUID>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "*, posts(*, users(*), posts_likes(user, users(fullname, username)))"
    )
    .eq("username", userId)
    .single();
  if (error) return { error };
  return { data };
}
