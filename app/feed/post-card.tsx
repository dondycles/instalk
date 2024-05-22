import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/database.types";
import { BiLike } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePublic, MdLockOutline } from "react-icons/md";
import likePost from "../actions/post-like-post";
import { useQueryClient } from "@tanstack/react-query";
import unlikePost from "../actions/post-unlike-post";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    setTimeout(() => setIsLiking(false), 1000);
  };

  const handleUnlike = async () => {
    if (!user) return;
    setIsLiking(true);
    await unlikePost(post.id, user?.id);
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    setTimeout(() => setIsLiking(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-1">
          <FaUserCircle className="text-4xl" />
          <div className="flex flex-col">
            <p className="text-sm">@{post.users?.username}</p>
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
      </CardHeader>
      <CardContent className="whitespace-pre-line">{post.content}</CardContent>
      <div className="px-4 pb-4 text-xs text-muted-foreground flex flex-row gap-4">
        <Dialog>
          <DialogTrigger>
            <button className="hover:underline">
              {post.posts_likes?.length ?? 0} likes(s)
            </button>
          </DialogTrigger>
          <DialogContent className="flex">
            {post.posts_likes?.map((liker) => {
              return (
                <div
                  key={liker.id}
                  className="text-sm"
                >{`@${liker.users?.username}`}</div>
              );
            })}
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
        >
          <BiLike className="text-lg" />
          <p>Like</p>
        </Button>
        <Input placeholder="Comment" disabled className="min-h-0" />
      </CardFooter>
    </Card>
  );
}
