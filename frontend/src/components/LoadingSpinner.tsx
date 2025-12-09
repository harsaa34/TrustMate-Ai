// src/components/common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ fullScreen = false, message }: LoadingSpinnerProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};

export default LoadingSpinner;