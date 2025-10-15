export default function Loading() {
  return (
    <div
      id="loading-screen"
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
}
