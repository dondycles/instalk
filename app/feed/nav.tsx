import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FaUserCircle } from "react-icons/fa";
import logOut from "../actions/log-out";
import { useQueryClient } from "@tanstack/react-query";

export default function FeedNav() {
  const queryClient = useQueryClient();
  const handleLogOut = async () => {
    queryClient.clear();
    await logOut();
  };
  return (
    <div className="flex gap-4 items-center">
      <p className="font-bold">Instalk.</p>
      <Input placeholder="Search" className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"}>
            <FaUserCircle className="text-xl" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
