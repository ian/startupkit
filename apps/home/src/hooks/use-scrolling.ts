"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const HEIGHT_INCREMENTS = 500;
const PERCENT_INCREMENTS = 10;

/**
 * Track scroll events to 10% increment percentages.
 */
export const useScrolling = () => {
  const pathname = usePathname();
  const lastHeight = useRef(0);
  const lastPercentage = useRef(0);

  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    lastHeight.current = 0;
    lastPercentage.current = 0;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      const scrollIncrement =
        Math.floor(scrollPosition / HEIGHT_INCREMENTS) * HEIGHT_INCREMENTS;
      const percentage =
        Math.floor(scrollPercentage / PERCENT_INCREMENTS) * PERCENT_INCREMENTS;

      if (scrollPosition > 25) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return {
    isTop,
  };
};
