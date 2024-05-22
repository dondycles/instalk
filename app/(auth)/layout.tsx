"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="m-auto max-w-[400px] w-full">
        <nav className="flex justify-between">
          <Button asChild>
            <Link href={"/"}>Back</Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link
              href={
                (pathname === "/signup" && "/login") ||
                (pathname === "/login" && "/signup") ||
                "/"
              }
            >
              {(pathname === "/signup" && "Log In") ||
                (pathname === "/login" && "Sign Up") ||
                "/"}
            </Link>
          </Button>
        </nav>
        {children}
      </div>
    </div>
  );
}
