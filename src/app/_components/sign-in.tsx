"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Button
      onClick={() =>
        signIn("github", { callbackUrl: "/calendar", redirect: false })
      }
    >
      Sign in
    </Button>
  );
};

export default SignIn;
