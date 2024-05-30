"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getChat(chatId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_participants")
    .select("*, users(*)")
    .eq("chat", chatId);
  if (error) return { error: error };
  return { data: data };
}
