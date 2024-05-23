"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const UUID = z.string().uuid();

export default async function getFriendStatus(
  userId: z.infer<typeof UUID>,
  myId: z.infer<typeof UUID>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friend_reqs")
    .select("*")
    .or(
      `and(user_2.eq.${userId},user_1.eq.${myId}),and(user_1.eq.${userId},user_2.eq.${myId})`
    )
    .single();

  if (error) return { error: error };
  return { success: data };
}
