import { motion } from "framer-motion";
import { CopyCmd } from "./CopyCmd";
import NpmVersion from "./NpmVersion";

export const Hero = () => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center h-full px-10">
      <motion.div
        initial={{ opacity: 0, marginTop: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, marginTop: -10, scale: 1 }}
        viewport={{ once: true }}
        className="py-8 mx-auto text-center md:max-w-screen-sm lg:max-w-screen-md lg:py-16 lg:px-12"
      >
        <Badge />
        <h1 className="mb-4 font-serif text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
          {/* The Ultimate Startup Framework */}
          {/* Everything you need to launch a SaaS product */}
          Launch Faster with StartupKit
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl">
          {/* StartupKit is the open-source SaaS framework designed to ensure you
          not only launch but also thrive. */}
          Your SaaS framework in a box. Built using modern open-source
          frameworks and packed full of integrations, StartupKit provides
          everything you need to build, grow, and scale your startup.
        </p>
        <div className="flex flex-col items-center mb-8 space-y-4 lg:mb-16 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <span className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
            Get started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <CopyCmd />
        </div>
      </motion.div>
    </section>
  );
};

const Badge = () => {
  return (
    <a
      className="inline-flex items-center justify-between px-1 py-1 pr-4 text-sm text-white rounded-full mb-7 bg-blue-500/30 hover:scale-105 transition-all duration-150"
      role="alert"
      href="https://www.npmjs.com/package/startupkit"
      rel="noopen nofollow"
      target="_blank"
    >
      <span className="text-xs bg-blue-500 rounded-full text-white px-4 py-1.5 mr-3">
        New
      </span>{" "}
      <span className="font-mono text-sm font-medium text-white">
        startupkit
        <span className="text-orange-400">
          <NpmVersion packageName="startupkit" />
        </span>
      </span>
      <svg
        className="w-5 h-5 ml-2"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </a>
  );
};
