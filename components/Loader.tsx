"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-green-200 dark:border-green-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-600 dark:border-green-400 rounded-full border-t-transparent animate-rotate"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );
}
