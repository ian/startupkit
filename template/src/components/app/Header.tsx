"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Sidebar } from "./Sidebar";

export const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-40 flex items-center w-full px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu aria-hidden="true" className="w-6 h-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="w-8 h-8 rounded-full bg-gray-50"
          />
        </a>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export const MobileSidebar = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <div className={clsx(open ? "block" : "hidden", "fixed h-full")}>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{
          opacity: open ? 1 : 0,
          x: open ? 0 : -100,
        }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-50 flex flex-1 w-full h-full max-w-xs mr-16 transform"
      >
        <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
          <button
            type="button"
            onClick={() => onClose()}
            className="-m-2.5 p-2.5"
          >
            <span className="sr-only">Close sidebar</span>
            <X aria-hidden="true" className="w-6 h-6 text-white" />
          </button>
        </div>

        <Sidebar />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-gray-900/80"
        onClick={() => onClose()}
      />
    </div>
  );
};
