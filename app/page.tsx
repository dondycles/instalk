import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4  w-full h-full flex">
      <div className="m-auto space-y-4 w-fit flex flex-col">
        <div>
          <h1 className="text-4xl font-black">Instalk.</h1>
          <p>Talk to everyone, instantly.</p>
        </div>
        <div className="flex gap-4 flex-1">
          <Button className="flex-1" asChild>
            <Link href={"/signup"}>Sign Up</Link>
          </Button>
          <Button variant={"outline"} className="flex-1" asChild>
            <Link href={"/login"}>Log In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
