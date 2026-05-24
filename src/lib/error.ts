export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super(payload);
    this.status = status;
    this.payload = payload;
  }
}
