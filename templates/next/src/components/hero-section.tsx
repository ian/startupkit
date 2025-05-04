"use client"

import LogoCloud from "./logo-cloud";
import { Container } from "@/components/container";
import { ButtonLink } from "@brokerbot/ui/components/button";
import { useIsMobile } from "@brokerbot/ui/hooks";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4, // 200ms stagger
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <section className="relative pt-16 md:pt-24 overflow-hidden border-b">
      {/* Color flare effect */}
      <div className="color-flare-container">
        <div className="color-flare-content">
          <div className="color-flare-blur-rotate">
            <div className="color-flare-conic" />
          </div>
          <div className="color-flare-blur-rotate">
            <div className="color-flare-conic" />
          </div>
          <div className="color-flare-blur-rotate">
            <div className="color-flare-conic" />
          </div>
        </div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto items-center flex flex-col items-center">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold font-serif max-w-4xl mx-auto mb-6"
              variants={itemVariants}
            >
              AI Teammates that Power Your Real Estate Brokerage
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
              variants={itemVariants}
            >
              BrokerBot can automate administrative tasks, ensure compliance, and empower your team to focus on what matters most —
              building relationships.
            </motion.p>

            {/* Buttons */}
            <motion.div className="w-auto" variants={itemVariants}>
              <ButtonLink className="hover:scale-105 transition-all" size={isMobile ? undefined : "xl"} href="https://cal.com/jt-hotsheet/brokerbot-demo" target="_blank">Schedule a Demo</ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      <Container className="relative z-30">
        <LogoCloud />
      </Container>

      <motion.div
        className="mx-5 md:mx-auto md:px-5 hidden md:block"
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
      >
        <div className="relative z-10 max-w-6xl mx-auto overflow-hidden rounded-t-lg border border-b-0 relative top-[10px] shadow-lg">
          <img
            src="/hero/screenshot.avif"
            className="w-full"
            alt="BrokerBot Screenshot"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
