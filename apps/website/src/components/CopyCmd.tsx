"use client";

import { Copy } from "lucide-react";
import { WaitlistDiaglog } from "./WaitlistDialog";

export const CopyCmd = () => {
  // const text = "npx startupkit";
  //
  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     alert("Text copied to clipboard!");
  //   } catch (err) {}
  // };

  return (
    <WaitlistDiaglog>
      <div className="flex items-center gap-2 px-4 py-2 font-mono text-white rounded-full bg-blue-900/50 cursor-pointer hover:bg-blue/40 transition-all duration-300">
        $ npx startupkit@latest
        <Copy size={16} />
      </div>
    </WaitlistDiaglog>
  );
};
