import { FaUserCircle } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "@/database.types";
import { MdLockOutline, MdOutlinePublic } from "react-icons/md";
import { useEffect, useState } from "react";
import addFriend from "../../actions/add-friend";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getFriendStatus from "../../actions/get-friendstatus";
import acceptFriend from "../../actions/accept-friend";
import createChat from "@/app/actions/create-chat";

export default function UserHoverCard({
  post,
  user,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
  user?: Database["public"]["Tables"]["users"]["Row"];
}) {
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isAcceptingFriend, setIsAcceptingFriend] = useState(false);
  const [onOpenChange, setOnOpenChange] = useState(false);
  const queryClient = useQueryClient();

  const { data: friendStatus, refetch } = useQuery({
    queryKey: ["friendStatus", post.user],
    queryFn: async () => getFriendStatus(post.user, user?.id ?? ""),
    enabled: Boolean(user) && onOpenChange,
    refetchOnMount: false,
  });

  const iRequested = Boolean(friendStatus?.success?.user_1 === user?.id);
  const isAccepted = Boolean(friendStatus?.success?.isAccepted);
  const handleAcceptFriend = async () => {
    if (!user) return;
    if (!friendStatus?.success) return;
    if (isAccepted) return;
    if (iRequested) return;

    setIsAcceptingFriend(true);
    await acceptFriend(post.user, user.id, friendStatus?.success?.id);
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", post.user],
    });
    queryClient.invalidateQueries({
      queryKey: ["friends"],
    });

    setIsAcceptingFriend(false);
  };
  const handleAddFriend = async () => {
    if (!user) return;
    if (user?.id === post.user) return;
    setIsAddingFriend(true);
    await addFriend(post.user, user.id);
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", post.user],
    });
    queryClient.invalidateQueries({
      queryKey: ["friends"],
    });
    setIsAddingFriend(false);
  };

  useEffect(() => {
    refetch();
  }, [onOpenChange]);
  return (
    <HoverCard openDelay={250} onOpenChange={setOnOpenChange}>
      <HoverCardTrigger asChild className="group/user">
        <CardTitle className="flex flex-row gap-1">
          <FaUserCircle className="text-4xl" />
          <div className="flex flex-col">
            <Link
              href={"/u/" + post.users?.username}
              className="text-sm group-hover/user:underline"
            >
              @{post.users?.username}
            </Link>
            <div className="flex flex-row items-center gap-1">
              <p className="text-xs font-normal">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div className="text-sm">
                {post.privacy === "public" ? (
                  <MdOutlinePublic />
                ) : (
                  <MdLockOutline />
                )}
              </div>
            </div>
          </div>
        </CardTitle>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="space-y-4 ">
        <div className="flex flex-row items-center gap-2">
          <FaUserCircle className="text-5xl" />
          <div className="flex flex-col">
            <p className="font-bold group-hover/user:underline">
              {post.users?.fullname}
            </p>
            <p className="text-sm group-hover/user:underline">
              @{post.users?.username}
            </p>
          </div>
        </div>
        {user?.id !== post.user && (
          <>
            <div className="flex flex-row gap-4">
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
            {friendStatus?.success?.isAccepted && (
              <Button
                onClick={async () => {
                  const { success } = await createChat(post.user);
                }}
                className="w-full flex gap-1 items-center"
              >
                <p>Chat</p> <FaMessage />
              </Button>
            )}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
