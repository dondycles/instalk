"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const UUID = z.string().uuid();

export default async function getFriends(myId: z.infer<typeof UUID>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friend_reqs")
    .select("*")
    .or(`user_2.eq.${myId},user_1.eq.${myId}`);
  if (error) return { error: error };
  return { success: data };
}
