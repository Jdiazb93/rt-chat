"use client";
import Link from "next//link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function NavbarComponent() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 w-full px-5 py-3 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl">Real Time Chat</h1>
      </Link>
      <div className="flex items-center gap-x-5">
        <Link href="/live-chat">
          <span className="text-xl underline hover:text-gray-300">
            Live Chat
          </span>
        </Link>
        {session ? (
          <div className="flex items-center gap-x-5">
            <div className="flex items-center gap-x-3">
              <span>
                <p className="text-xl">{session.user?.name}</p>
                <p className="text-sm text-gray-300">{session.user?.email}</p>
              </span>
              {session.user?.image && (
                <img
                  src={session.user?.image}
                  alt="usr-img"
                  className="w-10 h-10 rounded-full"
                />
              )}
            </div>
            <button
              className="px-3 py-2 bg-sky-600 rounded text-xl hover:bg-sky-500 duration-200 transition ease-in-out"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="px-3 py-2 bg-sky-600 rounded text-xl hover:bg-sky-500 duration-200 transition ease-in-out"
            onClick={() => signIn("google", { callbackUrl: "/live-chat" })}
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
}
