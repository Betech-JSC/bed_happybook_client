"use client";

interface ReplaceFlightDraftDialogProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ReplaceFlightDraftDialog({
  open,
  message,
  onCancel,
  onConfirm,
}: ReplaceFlightDraftDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="replace-draft-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="replace-draft-title"
          className="text-lg font-bold text-gray-900"
        >
          Chọn chuyến mới?
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#1570EF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0C4089]"
          >
            Chọn chuyến mới
          </button>
        </div>
      </div>
    </div>
  );
}
