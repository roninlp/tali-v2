"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  );
};

export default SignOut;
