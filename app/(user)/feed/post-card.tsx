import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/database.types";
import { BiLike } from "react-icons/bi";
import likePost from "../../actions/like-post";
import { useQueryClient } from "@tanstack/react-query";
import unlikePost from "../../actions/unlike-post";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserHoverCard from "./user-hovercard";

export default function PostCard({
  post,
  user,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
  user?: Database["public"]["Tables"]["users"]["Row"];
}) {
  const queryClient = useQueryClient();

  const isLiked = Boolean(
    post.posts_likes?.find((liker) => liker.user === user?.id)
  );
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    setIsLiking(true);
    await likePost(post.id);
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({
      queryKey: ["profile", post.users?.username],
    });
    setTimeout(() => setIsLiking(false), 1000);
  };

  const handleUnlike = async () => {
    if (!user) return;
    setIsLiking(true);
    await unlikePost(post.id, user?.id);
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({
      queryKey: ["profile", post.users?.username],
    });
    setTimeout(() => setIsLiking(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <UserHoverCard post={post} user={user} />
      </CardHeader>
      <CardContent className="whitespace-pre-line">{post.content}</CardContent>
      <div className="px-4 pb-4 text-xs text-muted-foreground flex flex-row gap-4">
        <Dialog>
          <DialogTrigger>
            <button className="hover:underline">
              {post.posts_likes?.length ?? 0} likes(s)
            </button>
          </DialogTrigger>

          <DialogContent className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>People who liked this post.</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70dvh]">
              <div className="flex flex-col gap-4">
                {post.posts_likes?.map((liker) => {
                  return (
                    <div
                      key={liker.id}
                      className="text-sm rounded-md border-border border p-4"
                    >{`@${liker.users?.username}`}</div>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <p>0 comments(s)</p>
      </div>
      <Separator className="mb-4" />
      <CardFooter className="gap-4 items-start">
        <Button
          disabled={isLiking}
          onClick={isLiked ? handleUnlike : handleLike}
          variant={isLiked ? "default" : "ghost"}
          className="text-xs flex flex-row gap-1 items-center"
          size={"icon"}
        >
          <BiLike className="text-lg" />
        </Button>
        <Input placeholder="Comment" disabled className="min-h-0 flex-1" />
      </CardFooter>
    </Card>
  );
}
