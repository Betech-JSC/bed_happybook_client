export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    const message =
      typeof payload === "string"
        ? payload
        : typeof payload?.message === "string"
          ? payload.message
          : typeof payload?.code === "string"
            ? payload.code
            : "HTTP request failed";
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}
