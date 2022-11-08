import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/src/pages" className="btn-ghost btn text-xl normal-case">
          KrisKringle
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link href="/src/pages/home">Home</Link>
          </li>
          <li>
            <Link href="/signup">Signup</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
