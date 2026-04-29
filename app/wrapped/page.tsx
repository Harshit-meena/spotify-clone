import { Suspense } from "react";
import WrappedClient from "./components/WrappedClient";

export default function WrappedPage() {
  return (
    <Suspense fallback={<WrappedLoading />}>
      <WrappedClient />
    </Suspense>
  );
}

function WrappedLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 
          border-t-transparent rounded-full animate-spin mx-auto mb-4" 
        />
        <p className="text-white text-xl">
          Creating your {new Date().getFullYear()} Wrapped...
        </p>
      </div>
    </div>
  );
}