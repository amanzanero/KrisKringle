import { useSession } from "next-auth/react";
import { log as appLogger } from "next-axiom";

export const useAppLogger = () => {
  const session = useSession();

  if (!session.data?.user) {
    return appLogger.with({ userId: session.data?.user?.id });
  } else {
    return appLogger;
  }
};
