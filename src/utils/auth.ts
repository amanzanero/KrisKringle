import { signIn, useSession } from "next-auth/react";

export const useSessionOrRedirect = () => {
  const session = useSession();

  if (session.status === "unauthenticated") {
    signIn();
  }

  return session;
};
