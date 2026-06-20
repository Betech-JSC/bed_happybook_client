import { useEffect, useState } from "react";
import { settingApi } from "@/api/Setting";

export function useWelcomeDiscount(productType: string) {
  const [welcomeDiscount, setWelcomeDiscount] = useState<{
    type: "amount" | "percent";
    value: number;
    valueUsd?: number;
    programCode: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const programCode = sessionStorage.getItem("applied_welcome_program");
    if (!programCode) {
      setWelcomeDiscount(null);
      return;
    }

    const fetchWelcomeSettings = async () => {
      try {
        const response = await settingApi.getWelcomeSettings();
        const settings = response?.payload?.data ?? {};

        if (programCode === "WELCOME50K") {
          if (["business-lounge", "fast-track"].includes(productType)) {
            const vndValue = settings.welcome50k_vnd_discount_amount ? Number(settings.welcome50k_vnd_discount_amount) : 50000;
            const usdValue = settings.welcome50k_usd_discount_amount ? Number(settings.welcome50k_usd_discount_amount) : 2;
            setWelcomeDiscount({
              type: "amount",
              value: vndValue,
              valueUsd: usdValue,
              programCode
            });
            return;
          }
        } else if (programCode === "WELCOME10") {
          const percents: Record<string, number> = {
            "fast-track": settings.welcome10_fast_track_discount_percent ? Number(settings.welcome10_fast_track_discount_percent) : 5,
            "yacht": settings.welcome10_yacht_discount_percent ? Number(settings.welcome10_yacht_discount_percent) : 2,
            "entertainment_ticket": settings.welcome10_entertainment_ticket_discount_percent ? Number(settings.welcome10_entertainment_ticket_discount_percent) : 5,
            "insurance": settings.welcome10_insurance_discount_percent ? Number(settings.welcome10_insurance_discount_percent) : 10,
            "visa": settings.welcome10_visa_discount_percent ? Number(settings.welcome10_visa_discount_percent) : 5
          };
          if (percents[productType] !== undefined) {
            setWelcomeDiscount({
              type: "percent",
              value: percents[productType],
              programCode
            });
            return;
          }
        }
        setWelcomeDiscount(null);
      } catch (error) {
        console.error("Error fetching welcome settings:", error);
        // fallback
        if (programCode === "WELCOME50K") {
          if (["business-lounge", "fast-track"].includes(productType)) {
            setWelcomeDiscount({
              type: "amount",
              value: 50000,
              valueUsd: 2,
              programCode
            });
          }
        } else if (programCode === "WELCOME10") {
          const percents: Record<string, number> = {
            "fast-track": 5,
            "yacht": 2,
            "entertainment_ticket": 5,
            "insurance": 10,
            "visa": 5
          };
          if (percents[productType] !== undefined) {
            setWelcomeDiscount({
              type: "percent",
              value: percents[productType],
              programCode
            });
          }
        }
      }
    };

    fetchWelcomeSettings();
  }, [productType]);

  return welcomeDiscount;
}
