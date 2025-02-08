const username = process.env.NEXT_PUBLIC_VIETQR_USERNAME;
const password = process.env.NEXT_PUBLIC_VIETQR_PASSWORD;

const generateToken = async () => {
  try {
    const response = await fetch(
      "https://dev.vietqr.org/vqr/api/token_generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      }
    );

    if (!response.ok) {
      console.log(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

const generateQrCode = async (token: string) => {
  try {
    const response = await fetch(
      "https://dev.vietqr.org/vqr/api/qr/generate-customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 5000,
          content: "VietQRTEST",
          bankAccount: "0852240768",
          bankCode: "MB",
          userBankName: "HA TRUNG HIEU",
          transType: "C",
          orderId: "VietQRTEST",
          qrType: "0",
        }),
      }
    );

    if (!response.ok) {
      console.log(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

export { generateQrCode, generateToken };
