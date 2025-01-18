interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: string;
}

export default function LoadingButton({
  isLoading,
  text,
  disabled,
  onClick,
  style,
}: LoadingButtonProps) {
  return (
    <button
      className={`mt-2 w-full bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover ${style}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <span className="loader_spiner"></span> : text}
    </button>
  );
}
