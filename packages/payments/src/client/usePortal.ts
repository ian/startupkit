import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const usePortal = ({ redirectTo }: { redirectTo?: string } = {}) => {
  const router = useRouter();

  const redirectToPortal = useCallback(async () => {
    const { redirectUrl: portalUrl } = await fetch("/api/payments/portal", {
      method: "POST",
      body: JSON.stringify({ redirectTo }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    router.push(portalUrl);
  }, [router, redirectTo]);

  return { redirectToPortal };
};
