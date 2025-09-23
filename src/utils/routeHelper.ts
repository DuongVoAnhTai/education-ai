"use client";

import { useRouter } from "next/navigation";

export function useAppRouter() {
  const router = useRouter();

  return {
    goHome: () => router.push("/"),
    goLogin: () => router.push("/login"),
    goAdmin: () => router.push("/admin"),
    goForbidden: () => router.push("/403"),
    replaceLogin: () => router.replace("/login"),
  };
}
