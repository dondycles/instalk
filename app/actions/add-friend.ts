"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const UUID = z.string().uuid();

export default async function addFriend(
  userId: z.infer<typeof UUID>,
  myId: z.infer<typeof UUID>
) {
  const supabase = createClient();

  const { data } = await supabase
    .from("friend_reqs")
    .select("id")
    .or(
      `and(user_2.eq.${userId},user_1.eq.${myId}),and(user_1.eq.${userId},user_2.eq.${myId})`
    )
    .single();

  if (data) {
    await supabase
      .from("friend_reqs")
      .delete()
      .or(
        `and(user_2.eq.${userId},user_1.eq.${myId}),and(user_1.eq.${userId},user_2.eq.${myId})`
      );

    return;
  }
  const { error } = await supabase.from("friend_reqs").insert({
    user_2: userId,
  });
  if (error) return { error: error };
  return { success: "Added!" };
}
