"use client";

import { useQuery } from "@tanstack/react-query";
import PostForm from "./post-form";
import getPosts from "../actions/get-posts";
import PostCard from "./post-card";
import getUser from "../actions/get-user";
import React, { useEffect } from "react";
import FeedNav from "./nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import getFriends from "../actions/get-friends";
import getFriend from "../actions/get-friend";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import UserRequestCard from "./user-requestcard";

export default function Feed() {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });

  const { data: feedData, isLoading: feedDataLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => await getPosts(),
  });

  const { data: friendsAndReqsData, isLoading: friendsAndReqsDataLoading } =
    useQuery({
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
      const fullname = (await getFriend(friendId)).data?.fullname;

      if (friend.isAccepted !== true) continue;
      arrangedFriends.push({
        id: friend.id,
        friend: friendId,
        fullname,
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
      const fullname = (await getFriend(friendId)).data?.fullname;

      if (friend.isAccepted === true) continue;
      if (friend.user_1 === userData?.data?.id) continue;
      arrangedRequests.push({
        id: friend.id,
        friend: friendId,
        fullname,
      });
    }
    return arrangedRequests;
  };

  useEffect(() => {
    refetchArrangedFriendsData();
    refetchArrangedRequestsData();
  }, [friendsAndReqsData?.success]);

  return (
    <main className="p-4 pb-0 w-full h-full flex flex-col gap-4">
      <FeedNav />
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
            >
              <FaUserCircle className="text-2xl min-w-fit" />
              <p className="truncate w-full text-left">
                {userData?.data?.fullname}
              </p>
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
                    >
                      <FaUserCircle className="text-2xl min-w-fit" />
                      <p className="truncate w-full text-left">
                        {friend.fullname}
                      </p>
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
