import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        OmniClip Studio
      </h1>
      <p className="text-gray-400 max-w-xl mb-8">
        Instantly upload videos, split clips, generate platform captions, and schedule your content calendar all in one fast workspace.
      </p>
      <div className="space-x-4">
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition">
          Open Studio Dashboard
        </Link>
        <Link href="/login" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition">
          Login / Register
        </Link>
      </div>
    </main>
  );
}