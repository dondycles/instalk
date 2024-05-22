"use client";
import { login } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export const logInSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

export default function LogIn() {
  const router = useRouter();
  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: undefined,
      password: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof logInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { error, success } = await login(values);
    if (success) {
      router.push("/feed");
    }
    if (error) {
      router.push("/error");
    }
  }

  return (
    <main className="h-full w-full flex">
      <Card className="h-fit m-auto  w-full">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="flex-1"
              >
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
