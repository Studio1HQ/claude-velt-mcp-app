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
import { ChevronDown, User as UserIcon, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { currentUser, setCurrentUser } = useWhiteboardStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          Collaborative Whiteboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Velt Collaboration Tools */}
        <div className="flex items-center gap-2 border-r pr-3">
          <VeltCommentTool shadowDom={false} />
          <VeltSidebarButton shadowDom={false} />
          <VeltNotificationsTool shadowDom={false} />
        </div>

        {/* User Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <UserIcon className="h-4 w-4" />
              {/* )} */}
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
                <UserIcon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                {currentUser.userId === user.userId && (
                  <span className="ml-auto text-xs text-green-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switcher */}
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="gap-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}
        <VeltPresence shadowDom={false} />
      </div>
    </header>
  );
}
