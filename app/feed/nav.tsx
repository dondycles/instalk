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

import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import searchUser from "../actions/search-user";
import { useDebounce } from "@/lib/useDebounce";
import { Database } from "@/database.types";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeedNav() {
  const [focused, setFocused] = useState(false);
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [result, setResult] =
    useState<Database["public"]["Tables"]["users"]["Row"][]>();
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    const { data } = await searchUser(debouncedQuery);
    setResult(data);
    setShowResults(true);
  };
  const handleLogOut = async () => {
    queryClient.clear();
    await logOut();
  };
  useEffect(() => {
    if (query === "") return setShowResults(false);
    handleSearch();
  }, [debouncedQuery]);
  return (
    <div className="flex gap-4 items-center">
      <p className="font-bold">Instalk.</p>
      <div className="flex-1 relative h-fit">
        <Input
          onFocus={() => {
            if (query !== "") {
              setShowResults(true);
            }
          }}
          onBlur={() => {
            if (focused) return;
            setShowResults(false);
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full z-10"
        />
        {showResults && (
          <div
            onClick={() => setFocused(true)}
            onMouseOver={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
            className="w-full p-4 absolute top-[calc(100%+16px)] left-0 h-fit z-10 bg-white border rounded-md"
          >
            <p className="text-muted-foreground text-sm mb-4">results...</p>
            <ScrollArea className="max-h-[200px] w-full">
              <div className="flex flex-col gap-4 overflow-auto h-full max-h-full">
                {result?.length ? (
                  result?.map((res) => {
                    return (
                      <Button key={res.id} asChild>
                        <Link href={"/u/" + res.id}>{res.fullname}</Link>
                      </Button>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    No result.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"}>
            <FaUserCircle className="text-xl" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
