"use client";

import { useWhiteboardStore } from "@/lib/store/whiteboard-store";
import { USERS } from "@/lib/constants/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  VeltSidebarButton,
  VeltNotificationsTool,
  VeltCommentTool,
  VeltPresence,
} from "@veltdev/react";
import { ChevronDown, User as UserIcon } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { currentUser, setCurrentUser } = useWhiteboardStore();

  return (
    <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Collaborative Whiteboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Velt Collaboration Tools */}
        <div className="flex items-center gap-2 border-r pr-3">
          <VeltCommentTool />
          <VeltSidebarButton />
          <VeltNotificationsTool />
        </div>

        {/* User Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {currentUser.photoUrl ? (
                <Image
                  src={currentUser.photoUrl}
                  alt={currentUser.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
              <span>{currentUser.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(USERS).map((user) => (
              <DropdownMenuItem
                key={user.userId}
                onClick={() => setCurrentUser(user)}
                className="gap-2"
              >
                {user.photoUrl && (
                  <Image
                    src={user.photoUrl}
                    alt={user.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                {currentUser.userId === user.userId && (
                  <span className="ml-auto text-xs text-green-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <VeltPresence />
      </div>
    </header>
  );
}
