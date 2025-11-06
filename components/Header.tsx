import { auth, signOut } from "@/auth";
import Image from "next/image";

export default async function Header() {
  const session = await auth();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1ED2AF] flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Cinema Guru"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-[#00003c]">Cinema Guru</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-[#00003c] text-sm">
          Welcome, {session?.user?.email}
        </span>
        <form
          action={async () => {
            await signOut();
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1 text-[#00003c] hover:text-white transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}