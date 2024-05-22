"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getUser() {
  const supabase = createClient();
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;

  if (!currentUserId) return;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", currentUserId)
    .single();
  console.log(data, error);
  if (error) return { error };
  return { data };
}
