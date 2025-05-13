interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ message = 'Nenhum dado encontrado', actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center h-64 text-gray-500">
      <svg
        className="h-16 w-16 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-lg">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 create-btn text-white p-2 "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}