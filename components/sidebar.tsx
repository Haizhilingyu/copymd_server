import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex  lg:fixed h-full lg:w-[256px] left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href={"/learn"}>
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src={"/tile_0000.png"} width={40} height={40} alt="logo" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            MyApp
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem
          label="Learn"
          iconSrc={"/next.svg"}
          href={"/learn"}
        ></SidebarItem>
        <SidebarItem
          label="Leaderboard"
          iconSrc={"/next.svg"}
          href={"/leaderboard"}
        ></SidebarItem>
        <SidebarItem
          label="quests"
          iconSrc={"/next.svg"}
          href={"/quests"}
        ></SidebarItem>
        <SidebarItem
          label="shop"
          iconSrc={"/next.svg"}
          href={"/shop"}
        ></SidebarItem>
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="w-5 h-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/"></UserButton>
        </ClerkLoaded>
      </div>
    </div>
  );
};
