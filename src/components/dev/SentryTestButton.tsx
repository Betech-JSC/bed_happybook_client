"use client";

import { triggerSentryTestError } from "@/lib/sentryTest";

export default function SentryTestButton() {
  return (
    <button
      type="button"
      onClick={triggerSentryTestError}
      className="fixed bottom-20 right-4 z-50 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-700"
    >
      Test Sentry error
    </button>
  );
}

