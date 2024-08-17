import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export const usePortal = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const redirectToPortal = useCallback(async () => {
    const { redirectUrl } = await fetch("/api/payments/portal", {
      method: "POST",
      body: JSON.stringify({ redirectTo: currentPath }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    router.push(redirectUrl);
  }, [currentPath, router]);

  return { redirectToPortal };
};
