import Image from "next/image";
import { Container } from "./Container";
import { cn } from "@/ui/utils";

export const Features = ({ className }: { className?: string }) => {
  return (
    <Container>
      <a id="features" />
      <section className={className}>
        <div className="py-8 mx-auto max-w-screen-xl">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white font-serif">
              {/* Everything you need to launch a SaaS product */}
              Powerful Integrations for Every Aspect of Your SaaS Product
            </h2>
            <p className="sm:text-xl text-gray-400">
              Save time and reduce costs with our pre-configured solutions.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div className="text-white flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue/20 lg:h-12 lg:w-12">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
                <div className="grid grid-cols-3 justify-start mt-4 gap-2">
                  {f.integrations?.map((i) => (
                    <div
                      className="flex flex-column justify-start items-center h-10 relative"
                      key={i.label}
                    >
                      {i.soon && (
                        <span className="px-1 py-0.5 bg-orange-500/80 text-white text-[0.4rem] rounded-lg -top-1 -right-4 absolute z-10">
                          SOON
                        </span>
                      )}
                      <Image
                        src={i.image}
                        alt={i.label}
                        className={cn(i.className, i.soon && "opacity-10")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

const FEATURES = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 16v5" />
        <path d="M16 14v7" />
        <path d="M20 10v11" />
        <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
        <path d="M4 18v3" />
        <path d="M8 14v7" />
      </svg>
    ),
    title: "Analytics",
    desc: "Understanding your users is crucial. Our analytics integrations provide you with clear insights to help you make better decisions and improve your product.",
    integrations: [
      {
        label: "Posthog",
        image: require("@/images/integrations/posthog.svg"),
        className: "h-4",
      },
      {
        label: "Google Analytics",
        image: require("@/images/integrations/google-analytics.svg"),
        className: "h-6",
      },
      {
        label: "Plausible",
        image: require("@/images/integrations/plausible.svg"),
        className: "h-6",
      },
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Authentication",
    desc: "Integrate seamless sign-up and login solutions with our authentication partners. Make user access easy and enhance their experience without compromising on quality.",
    integrations: [
      {
        label: "WorkOS",
        image: require("@/images/integrations/workos.svg"),
        className: "h-5",
      },
      {
        label: "Clerk",
        image: require("@/images/integrations/clerk.svg"),
        className: "h-6",
        soon: true,
      },
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    title: "Payments",
    desc: "Integrating payment providers shouldn't be complicated. Our solutions offer simple configuration for any modern payment provider, making it easy to process transactions and manage your finances.",
    integrations: [
      {
        label: "Stripe",
        image: require("@/images/integrations/stripe.svg"),
        className: "h-7",
      },
      {
        label: "Lemon Squeezy",
        image: require("@/images/integrations/lemon-squeezy.svg"),
        className: "h-8",
        soon: true,
      },
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        <path d="M8 11h8" />
        <path d="M8 7h6" />
      </svg>
    ),
    title: "Content Management",
    desc: "Bridge the gap between marketing and sales effortlessly. Our CMS solutions make it super easy to add and manage content like blogs, guides, and more, keeping your site engaging and up-to-date.",
    integrations: [
      {
        label: "ConvertKit",
        image: require("@/images/integrations/prismic.svg"),
        className: "h-6",
        soon: true,
      },
      {
        label: "Loops",
        image: require("@/images/integrations/payload.svg"),
        className: "h-6",
        soon: true,
      },
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
    title: "Newsletter",
    desc: "Our newsletter integrations make it easy to send updates, keep your audience informed, and manage beta launch waitlists, ensuring your community is always engaged.",
    integrations: [
      {
        label: "ConvertKit",
        image: require("@/images/integrations/convertkit.svg"),
        className: "h-7",
      },
      {
        label: "Loops",
        image: require("@/images/integrations/loops.svg"),
        className: "h-5",
      },
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </svg>
    ),
    title: "Affiliate",
    desc: "Drive sales and boost revenue with our comprehensive affiliate marketing tools. Effortlessly manage partnerships and track performance to maximize your earnings and grow your business.",
    integrations: [
      {
        label: "Tolt",
        image: require("@/images/integrations/tolt.svg"),
        className: "h-6",
        soon: true,
      },
    ],
  },
];
