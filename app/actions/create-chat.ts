"use server";

import { createClient } from "@/utils/supabase/server";

export default async function createChat(user: string) {
  const supabase = createClient();
  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .insert({})
    .select()
    .single();
  console.log(chatError);
  if (chatError) return { error: chatError };
  const { data: me, error: meError } = await supabase
    .from("chat_participants")
    .insert({
      chat: chatData.id,
    });
  if (meError) return { error: meError };
  const { data: participant, error: participantError } = await supabase
    .from("chat_participants")
    .insert({
      chat: chatData.id,
      user: user,
    });
  if (participantError) return { error: participantError };
  return { success: chatData.id };
}
