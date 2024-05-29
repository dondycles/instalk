"use client";
import { useQuery } from "@tanstack/react-query";
import FeedNav from "./nav";
import getUser from "../actions/get-user";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
  });

  return (
    <div className="w-full h-full flex flex-col ">
      <FeedNav user={userData?.data} />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
}
