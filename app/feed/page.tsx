"use client";

import { useQuery } from "@tanstack/react-query";
import PostForm from "./post-form";
import getPosts from "../actions/get-posts";
import PostCard from "./post-card";
import getUser from "../actions/get-user";
import React from "react";
import FeedNav from "./nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Feed() {
  const { data: feedData } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => await getPosts(),
  });
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });
  return (
    <main className="p-4 w-full h-full flex flex-col gap-4">
      <FeedNav />
      <ScrollArea className="w-full flex-1">
        <PostForm />
        <div className="flex flex-col gap-4 mt-4">
          {feedData?.data?.map((post) => {
            return (
              <PostCard
                key={post.id + "post"}
                post={post}
                user={userData?.data}
              />
            );
          })}
        </div>
      </ScrollArea>
    </main>
  );
}
