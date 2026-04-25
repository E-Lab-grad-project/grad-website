"use client";

import SandboxBuilder from "@/app/components/sandbox/SandboxBuilder";
import Link from "next/link";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function SandboxPage() {
  return (
    <main className="sandbox-root flex h-screen min-h-0 flex-col bg-linear-to-br from-[#8E98B0] via-[#8892A9] to-[#4F5562] p-6">
      <div className="sandbox-enter-nav mb-3 shrink-0">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-gray-800 underline decoration-gray-700/80 underline-offset-4 transition hover:text-gray-950 hover:decoration-gray-900"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="min-h-0 flex-1">
        <SandboxBuilder />
      </div>
    </main>
  );
}
