// toastConfig.ts
import { DefaultToastOptions } from "react-hot-toast";

export const toastOptions: DefaultToastOptions = {
  position: "top-center",
  duration: 5000,
  style: {
    background: "#333",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "8px",
    padding: "16px 22px",
    marginTop: "120px",
    textAlign: "center",
  },
  success: {
    duration: 3000,
    style: {
      background: "green",
    },
  },
  error: {
    style: {
      background: "red",
    },
  },
};
