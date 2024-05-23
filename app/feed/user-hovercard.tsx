import { FaUserCircle } from "react-icons/fa";
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
import { useState } from "react";
import addFriend from "../actions/add-friend";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getFriendStatus from "../actions/get-friendstatus";

export default function UserHoverCard({
  post,
  user,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
  user?: Database["public"]["Tables"]["users"]["Row"];
}) {
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const queryClient = useQueryClient();
  const handleAddFriend = async () => {
    if (!user) return;
    if (user?.id === post.user) return;
    setIsAddingFriend(true);
    await addFriend(post.user, user.id);
    setIsAddingFriend(false);
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", post.user],
    });
  };

  const { data: friendStatus } = useQuery({
    queryKey: ["friendStatus", post.user],
    queryFn: async () => getFriendStatus(post.user, user?.id ?? ""),
    enabled: !!user,
  });

  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger asChild className="group/user">
        <CardTitle className="flex flex-row gap-1">
          <FaUserCircle className="text-4xl" />
          <div className="flex flex-col">
            <Link
              href={"/" + user?.username}
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
          <div className="flex flex-row gap-4">
            <Button
              disabled={isAddingFriend}
              onClick={handleAddFriend}
              className="flex-1"
            >
              {Boolean(friendStatus?.success) ? "Cancel Request" : "Add Friend"}
            </Button>
            <Button
              hidden={true}
              className={`flex-1 ${Boolean(friendStatus?.success) && "hidden"}`}
              variant={"outline"}
            >
              Block
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
