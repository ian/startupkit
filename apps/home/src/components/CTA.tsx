"use client";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useAnalytics } from "@startupkit/analytics";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  CheckCircle,
  CircleSlash,
  Handshake,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "./Container";

const LOOPS_ENDPOINT =
  "https://app.loops.so/api/newsletter-form/clz5hkgyu02i26fk0jxvvjhot";

type FormData = {
  email: string;
};

export default function CTA() {
  const [isDone, setDone] = useState(false);
  const [isSending, setSending] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();
  const { track } = useAnalytics();

  const sendToLoops = ({ email }: FormData) => {
    setSending(true);
    fetch(LOOPS_ENDPOINT, {
      method: "POST",
      body: `email=${email}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(() => setDone(true))
      .then(() => {
        track("CTA:Register", { email });
      })
      .finally(() => setSending(false));
  };

  return (
    <Container className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
      <div id="newsletter">
        <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Subscribe to our newsletter.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Want to sidestep rookie mistakes and skyrocket your startup? Join
              the StartupKit community for insider tips you won&apos;t find in
              textbooks. Here&apos;s why you should subscribe:
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              {isDone ? (
                <p className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" /> Thanks we&apos;ll
                  be in touch soon.
                </p>
              ) : (
                <form
                  className="flex gap-2 w-full"
                  onSubmit={handleSubmit(sendToLoops)}
                >
                  <Input
                    {...register("email")}
                    required
                    placeholder="Enter your email"
                    className="grow"
                  />
                  <Input
                    type="hidden"
                    name="mailingLists"
                    value="cly2xnjbn002z0mme68uog1wk, cly4xnjbn002x0mme28uog1wk"
                  />
                  <Button type="submit" disabled={isSending}>
                    Sign me Up
                  </Button>
                </form>
              )}
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            {TOPICS.map(({ title, desc, icon }) => (
              <div className="flex flex-col items-start" key={title}>
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  {/* <CalendarFold
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  /> */}
                  {icon}
                </div>
                <dt className="mt-4 font-semibold text-white">{title}</dt>
                <dd className="mt-2 leading-7 text-gray-400">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Container>
  );
}

const TOPICS = [
  {
    title: "Expert Tips",
    desc: "We’re your go-to mentor with proven advice.",
    icon: <BadgeCheck />,
  },
  {
    title: "Success Stories",
    desc: "Learn from real entrepreneurs.",
    icon: <ChartNoAxesCombined />,
  },
  {
    title: "Pitfalls to Avoid",
    desc: "Learn from the mistakes of others.",
    icon: <CircleSlash />,
  },
  {
    title: "Exclusive Resources",
    desc: "Tools and templates to propel you.",
    icon: <Handshake />,
  },
];
