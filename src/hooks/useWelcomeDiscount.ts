import { useEffect, useState } from "react";

export function useWelcomeDiscount(productType: string) {
  const [welcomeDiscount, setWelcomeDiscount] = useState<{
    type: "amount" | "percent";
    value: number;
    programCode: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const programCode = sessionStorage.getItem("applied_welcome_program");
    if (programCode) {
      if (programCode === "WELCOME50K") {
        if (["business-lounge", "esim", "fast-track"].includes(productType)) {
          setWelcomeDiscount({
            type: "amount",
            value: 50000,
            programCode
          });
          return;
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
          return;
        }
      }
    }
    setWelcomeDiscount(null);
  }, [productType]);

  return welcomeDiscount;
}
