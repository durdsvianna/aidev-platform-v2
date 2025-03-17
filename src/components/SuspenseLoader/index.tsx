'use client'

import { useEffect } from "react";
import NProgress from "nprogress";

export default function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute h-16 w-16 rounded-full border-4 border-solid border-gray-200"></div>
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
      </div>
    </div>
  );
}
