import { Button } from "@/components/ui/button";
import { Database } from "@/database.types";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import acceptFriend from "../actions/accept-friend";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function UserRequestCard({
  friend,
  user,
}: {
  friend: {
    id: string;
    friend: string;
    fullname: string | undefined;
  };
  user?: Database["public"]["Tables"]["users"]["Row"];
}) {
  const queryClient = useQueryClient();
  const [isAcceptingFriend, setIsAcceptingFriend] = useState(false);

  const handleAcceptFriend = async () => {
    if (!user) return;
    setIsAcceptingFriend(true);
    await acceptFriend(friend.friend, user.id, friend.id);
    queryClient.invalidateQueries({
      queryKey: ["friendStatus", friend?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["friends"],
    });

    setIsAcceptingFriend(false);
  };

  return (
    <div
      key={friend.id}
      className="w-full flex flex-col gap-2 items-center h-fit px-4 py-2 border rounded-md"
    >
      <div className="w-full flex gap-1 items-center">
        <FaUserCircle className="text-2xl min-w-fit" />
        <Link
          href={"/" + friend.id}
          className="truncate w-full text-left text-sm hover:underline"
        >
          {friend.fullname}
        </Link>
      </div>
      <div className="flex flex-row gap-2 w-full justify-end ">
        <Button
          onClick={handleAcceptFriend}
          disabled={isAcceptingFriend}
          size={"icon"}
          className="size-7"
        >
          <Check className="size-4" />
        </Button>
        <Button
          disabled={isAcceptingFriend}
          size={"icon"}
          variant={"outline"}
          className="size-7"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
