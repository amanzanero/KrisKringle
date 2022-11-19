import React from "react";

export const PageSpacer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="mx-auto w-full max-w-screen-xl">{children}</div>
);
