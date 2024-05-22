"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { logInSchema } from "./login/page";
import { signUpSchema } from "./signup/page";

export async function login(logInData: z.infer<typeof logInSchema>) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: logInData.username + "@instalk.com",
    password: logInData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error };
  }

  return { success: "Logged in!" };
}

export async function signup(signUpData: z.infer<typeof signUpSchema>) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const userData = {
    email: signUpData.username + "@instalk.com",
    password: signUpData.password as string,
  };

  const { error: userDataError } = await supabase.auth.signUp(userData);

  if (userDataError) {
    return { error: userDataError };
  }

  const { error: dbError } = await supabase.from("users").insert({
    fullname: signUpData.fullname,
    username: signUpData.username,
  });

  if (dbError) {
    return { error: dbError };
  }

  return { success: "Logged in!" };
}
