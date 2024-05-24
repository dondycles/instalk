"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const UUID = z.string().uuid();

export default async function acceptFriend(
  userId: z.infer<typeof UUID>,
  myId: z.infer<typeof UUID>,
  reqId: z.infer<typeof UUID>
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("friend_reqs")
    .update({
      isAccepted: true,
    })
    .or(
      `and(user_2.eq.${userId},user_1.eq.${myId}),and(user_1.eq.${userId},user_2.eq.${myId}),id.eq.${reqId}`
    );
  console.log(error, "yes reqId");
  if (error) return { error: error };
  return { success: "Accepted!" };
}
