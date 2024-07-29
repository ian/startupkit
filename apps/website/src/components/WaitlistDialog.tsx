import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { useAnalytics } from "@startupkit/analytics";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const LOOPS_ENDPOINT =
  "https://app.loops.so/api/newsletter-form/clz5hkgyu02i26fk0jxvvjhot";

type FormData = {
  email: string;
};

export const WaitlistDiaglog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
        track("Waitlist:Register", { email });
      })
      .finally(() => setSending(false));
  };

  return (
    <Dialog>
      <DialogTrigger className="focus:outline-none">{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="gap-5">
          <DialogTitle>We&apos;re not quite ready yet ..</DialogTitle>
          <DialogDescription>
            We&apos;re still putting the finishing touches on StartupKit release
            for public usage.
          </DialogDescription>
          <DialogDescription>
            Join the waitlist and we&apos;ll let you know when we&apos;re live.
          </DialogDescription>
          {isDone ? (
            <DialogDescription className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Thanks we&apos;ll be in
              touch soon.
            </DialogDescription>
          ) : (
            <DialogDescription>
              <form className="flex gap-2" onSubmit={handleSubmit(sendToLoops)}>
                <Input
                  {...register("email")}
                  required
                  placeholder="richard@richardhendricks.com"
                />
                <Input
                  type="hidden"
                  name="mailingLists"
                  value="cly2xnjbn002z0mme68uog1wk, cly4xnjbn002x0mme28uog1wk"
                />
                <Button type="submit" disabled={isSending}>
                  Join Waitlist
                </Button>
              </form>
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
