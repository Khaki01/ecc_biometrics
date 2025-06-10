"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-[#1e293b] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">
        <Link href="/">AI Бет-анықтау</Link>
      </h1>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm">Қош келдіңіз, {user?.sub}</span>
            <button
              onClick={() => router.push("/identify")}
              className="bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600 text-sm"
            >
              Анықтау
            </button>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Шығу
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Кіру
          </Link>
        )}
      </div>
    </header>
  );
}
