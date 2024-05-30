"use client";
import getChat from "@/app/actions/get-chat";
import { useQuery } from "@tanstack/react-query";

export default function MessageRoom({ params }: { params: { id: string } }) {
  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ["chat", params.id],
    queryFn: async () => getChat(params.id),
  });
  return (
    <main className="p-4 pb-0 w-full h-full flex flex-col gap-4">
      {params.id}
      {JSON.stringify(chatData?.data)}
    </main>
  );
}
