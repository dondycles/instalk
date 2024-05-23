"use client";

import { useQuery } from "@tanstack/react-query";
import PostForm from "./post-form";
import getPosts from "../actions/get-posts";
import PostCard from "./post-card";
import getUser from "../actions/get-user";
import React from "react";
import FeedNav from "./nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Feed() {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });

  const { data: feedData, isLoading: feedDataLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => await getPosts(),
  });
  return (
    <main className="p-4 w-full h-full flex flex-col gap-4">
      <FeedNav />
      {feedDataLoading ? (
        <p className="text-center text-muted-foreground text-sm">
          Getting the latest posts...
        </p>
      ) : (
        <div className="overflow-auto w-full h-full flex flex-row gap-4">
          <div className="w-1/5">
            <Button
              variant={"ghost"}
              className="flex gap-2 items-center justify-center"
            >
              <FaUserCircle className="text-2xl" />
              <p className="line-clamp-1 flex-1">{userData?.data?.fullname}</p>
            </Button>
          </div>
          <ScrollArea className="max-w-[800px] w-3/5 min-w-[300px] mx-auto">
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
          <div className="w-1/5 flex-col flex gap-2">
            <p className="font-bold">Friends</p>
            <Separator />
          </div>
        </div>
      )}
    </main>
  );
}
