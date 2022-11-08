import React from "react";
import Navbar from "../components/Navbar";

const NavLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default NavLayout;
