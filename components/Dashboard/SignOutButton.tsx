"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs flex items-center gap-1.5 border-border hover:bg-error/10 hover:border-error/30 hover:text-error transition-all duration-150"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </Button>
  );
}

export default SignOutButton;
