"use client";

import { useQuery } from "@tanstack/react-query";
import PostForm from "./post-form";
import getPosts from "../../actions/get-posts";
import PostCard from "./post-card";
import getUser from "../../actions/get-user";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import getFriends from "../../actions/get-friends";
import getFriend from "../../actions/get-friend";

import UserRequestCard from "./user-requestcard";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function Feed() {
  const supabase = createClient();
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });

  const {
    data: feedData,
    isLoading: feedDataLoading,
    refetch: refetchFeedData,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => await getPosts(),
  });

  const {
    data: friendsAndReqsData,
    isLoading: friendsAndReqsDataLoading,
    refetch: refetchFriendsAndReqsData,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => await getFriends(userData?.data?.id ?? ""),
    enabled: !!userData?.data,
  });

  const {
    data: arrangedFriendsData,
    isLoading: arrangedFriendsLoading,
    refetch: refetchArrangedFriendsData,
  } = useQuery({
    queryKey: ["arrangedfriends"],
    queryFn: async () => await arrangeFriends(),
    enabled: !!userData?.data && !!friendsAndReqsData?.success,
  });

  const {
    data: arrangedRequestsData,
    isLoading: arrangedRequestsLoading,
    refetch: refetchArrangedRequestsData,
  } = useQuery({
    queryKey: ["arrangedrequests"],
    queryFn: async () => await arrangeRequests(),
    enabled: !!userData?.data && !!friendsAndReqsData?.success,
  });

  const arrangeFriends = async () => {
    if (!friendsAndReqsData?.success) return [];
    const arrangedFriends = [];
    for (const friend of friendsAndReqsData.success) {
      const friendId =
        friend.user_1 === userData?.data?.id ? friend.user_2 : friend.user_1;
      const { data } = await getFriend(friendId);

      if (friend.isAccepted !== true) continue;
      arrangedFriends.push({
        id: friend.id,
        friend: friendId,
        fullname: data?.fullname,
        username: data?.username,
      });
    }
    return arrangedFriends;
  };

  const arrangeRequests = async () => {
    if (!friendsAndReqsData?.success) return [];
    const arrangedRequests = [];

    for (const friend of friendsAndReqsData.success) {
      const friendId =
        friend.user_1 === userData?.data?.id ? friend.user_2 : friend.user_1;
      const { data } = await getFriend(friendId);

      if (friend.isAccepted === true) continue;
      if (friend.user_1 === userData?.data?.id) continue;
      arrangedRequests.push({
        id: friend.id,
        friend: friendId,
        fullname: data?.fullname,
        username: data?.username,
      });
    }
    return arrangedRequests;
  };

  useEffect(() => {
    const postchannels = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          refetchFeedData();
        }
      )
      .subscribe();

    const friendreqschannels = supabase
      .channel("friend_reqs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_reqs" },
        () => {
          refetchFriendsAndReqsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postchannels);
      supabase.removeChannel(friendreqschannels);
    };
  }, [supabase]);

  useEffect(() => {
    refetchArrangedFriendsData();
    refetchArrangedRequestsData();
  }, [friendsAndReqsData?.success]);

  return (
    <main className="p-4 pb-0 w-full h-full flex flex-col gap-4">
      {feedDataLoading ? (
        <p className="text-center text-muted-foreground text-sm">
          Getting the latest posts...
        </p>
      ) : (
        <div className="overflow-auto w-full h-full md:grid grid-cols-4 gap-4">
          <div className="col-span-1 hidden md:flex pb-4 w-full">
            <Button
              variant={"ghost"}
              className="w-full flex gap-1 items-center"
              asChild
            >
              <Link href={"/u/" + userData?.data?.username}>
                <FaUserCircle className="text-2xl min-w-fit" />
                <p className="truncate w-full text-left">
                  {userData?.data?.fullname}
                </p>
              </Link>
            </Button>
          </div>
          <ScrollArea className="w-full min-w-[300px] mx-auto col-span-2">
            <PostForm />
            <div className="flex flex-col gap-4 mt-4 pb-4">
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
          <div className="col-span-1 hidden md:flex pb-4 w-full flex-col gap-4 relative overflow-auto">
            <div className="flex flex-col gap-4 max-h-[33%] overflow-auto">
              <p className="text-sm font-bold">Friends</p>
              <div className="w-full flex flex-col gap-2">
                {arrangedFriendsData?.map((friend) => {
                  return (
                    <Button
                      key={friend.id}
                      variant={"ghost"}
                      className="w-full flex gap-1 items-center"
                      asChild
                    >
                      <Link href={"/u/" + friend.username}>
                        <FaUserCircle className="text-2xl min-w-fit" />
                        <p className="truncate w-full text-left">
                          {friend.fullname}
                        </p>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4  max-h-[33%] overflow-auto">
              <p className="text-sm font-bold">Requests</p>
              {arrangedRequestsData?.map((friend) => {
                return (
                  <UserRequestCard
                    key={friend.id}
                    friend={friend}
                    user={userData?.data}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
