import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import postPost from "../actions/post-post";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

export const postSchema = z.object({
  content: z.string().min(2).max(144),
  privacy: z.enum(["public", "private"]),
});

export default function PostForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      privacy: "public",
    },
  });

  async function onSubmit(values: z.infer<typeof postSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { error, success } = await postPost(values);

    if (error) return;
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    form.reset();
  }
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Post something..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-4 w-full">
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="ml-0 mr-auto">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="public"
                    >
                      <FormControl>
                        <SelectTrigger className="w-fit ">
                          <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues("content") && (
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>
              )}
              <Button disabled={form.formState.isSubmitting}>Post</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
