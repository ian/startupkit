import useSWR from "swr";

const url = "/api/payments/subscription";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSubscription = () => {
  const { data: subscription, mutate } = useSWR(url, fetcher);
  const refetch = async () => mutate(url);
  return { subscription, refetch };
};
