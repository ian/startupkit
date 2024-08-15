import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSubscription = () => {
  const { data: subscription } = useSWR("/api/payments/subscription", fetcher);
  return { subscription };
};
