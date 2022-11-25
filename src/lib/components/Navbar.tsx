import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();
  return (
    <div className="navbar bg-neutral px-2 text-neutral-content sm:px-5">
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold normal-case">
          KrisKringle
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          {status === "authenticated" ? (
            <li>
              <Link href="/home">Home</Link>
            </li>
          ) : undefined}
          <li>
            {status === "authenticated" ? (
              <button onClick={() => signOut()}>Log Out</button>
            ) : (
              <button onClick={() => signIn()}>Log In</button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
