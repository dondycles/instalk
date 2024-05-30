"use client";
import getProfile from "@/app/actions/get-profile";
import PostCard from "@/app/(user)/feed/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";
import getUser from "@/app/actions/get-user";
import getFriendStatus from "@/app/actions/get-friendstatus";
import { useEffect, useState } from "react";
import acceptFriend from "@/app/actions/accept-friend";
import addFriend from "@/app/actions/add-friend";
import { createClient } from "@/utils/supabase/client";

export default function UserPage({ params }: { params: { username: string } }) {
  const supabase = createClient();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isAcceptingFriend, setIsAcceptingFriend] = useState(false);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: profileDataLoading } = useQuery({
    queryKey: ["profile", params.username],
    queryFn: async () => await getProfile(params.username),
  });
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });

  const {
    data: friendStatus,
    refetch: refetchFriendStatus,
    isLoading: friendStatusLoading,
  } = useQuery({
    queryKey: ["friendStatus", profileData?.data?.id],
    queryFn: async () =>
      getFriendStatus(profileData?.data?.id ?? "", userData?.data?.id ?? ""),
    enabled: Boolean(profileData?.data),
    refetchOnMount: false,
  });

  const iRequested = Boolean(
    friendStatus?.success?.user_1 === userData?.data?.id
  );
  const isAccepted = Boolean(friendStatus?.success?.isAccepted);

  const handleAcceptFriend = async () => {
    if (!userData?.data) return;
    if (!profileData?.data) return;
    if (!friendStatus?.success) return;
    if (isAccepted) return;
    if (iRequested) return;

    setIsAcceptingFriend(true);
    await acceptFriend(
      profileData?.data?.id,
      userData?.data?.id,
      friendStatus?.success?.id
    );
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", profileData?.data?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["friends"],
    });

    setIsAcceptingFriend(false);
  };
  const handleAddFriend = async () => {
    if (!userData?.data) return;
    if (!profileData?.data) return;

    if (userData.data?.id === profileData?.data?.id) return;
    setIsAddingFriend(true);
    await addFriend(profileData?.data?.id, userData?.data?.id);
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", profileData?.data?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["friends"],
    });
    setIsAddingFriend(false);
  };

  useEffect(() => {
    const channels = supabase
      .channel("friend_reqs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_reqs" },
        () => {
          refetchFriendStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [supabase]);

  const isLoading =
    profileDataLoading || userDataLoading || friendStatusLoading;

  return (
    <main className="p-4 pb-0 w-full h-full flex flex-col gap-4">
      {isLoading ? (
        <p className="text-center text-muted-foreground text-sm">
          Getting info...
        </p>
      ) : (
        <>
          <Card>
            <CardHeader className="flex items-center">
              <div className="border rounded-md w-full h-32 bg-black/10 mb-4"></div>
              <div className=" bg-black/10 p-1 rounded-full">
                <FaUserCircle className="text-6xl min-w-fit " />
              </div>
              <p className="text-sm">@{profileData?.data?.username}</p>
              <p className="text-2xl font-bold">
                {profileData?.data?.fullname}
              </p>
              {userData?.data?.id !== profileData?.data?.id && (
                <div className="flex flex-row gap-4 w-1/2 min-w-fit">
                  <Button
                    disabled={isAddingFriend || isAcceptingFriend}
                    onClick={
                      Boolean(friendStatus?.success)
                        ? isAccepted
                          ? handleAddFriend
                          : iRequested
                          ? handleAddFriend
                          : handleAcceptFriend
                        : handleAddFriend
                    }
                    className="flex-1"
                    variant={isAccepted ? "destructive" : "default"}
                  >
                    {Boolean(friendStatus?.success)
                      ? isAccepted
                        ? "Unfriend"
                        : iRequested
                        ? "Cancel Request"
                        : "Accept Request"
                      : "Add Friend"}
                  </Button>
                  <Button
                    className={`flex-1 ${
                      Boolean(friendStatus?.success) && "hidden"
                    }`}
                    variant={"outline"}
                  >
                    Block
                  </Button>
                </div>
              )}
            </CardHeader>
          </Card>
          <p className="text-sm text-muted-foreground">Posts</p>
          <div className="flex flex-col gap-4 pb-4">
            {profileData?.data?.posts.map((post) => {
              return (
                <PostCard key={post.id} post={post} user={userData?.data} />
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
