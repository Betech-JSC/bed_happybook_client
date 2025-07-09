"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastLoadTime, setLastLoadTime] = useState(Date.now());
  const pathname = usePathname();
  const resetTime = parseInt(
    process.env.NEXT_PUBLIC_LOADING_RESET_TIME || "120000",
    10
  );
  const timeShowLoading: number = 3000;

  useEffect(() => {
    const loadingTimeout = setTimeout(
      () => setIsLoading(false),
      timeShowLoading
    );

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    let routeChangeTimeout: NodeJS.Timeout | null = null;

    const handleRouteChange = () => {
      const now = Date.now();
      if (now - lastLoadTime >= resetTime) {
        setIsLoading(true);
        setLastLoadTime(now);
        routeChangeTimeout = setTimeout(
          () => setIsLoading(false),
          timeShowLoading
        );
      }
      return () => {
        if (routeChangeTimeout) clearTimeout(routeChangeTimeout);
      };
    };

    handleRouteChange();
  }, [pathname, resetTime, lastLoadTime]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading phải được dùng trong LoadingProvider");
  }
  return context;
};
