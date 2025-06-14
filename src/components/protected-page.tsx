"use client";

import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { token } = useUser();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  return <>{children}</>;
}
