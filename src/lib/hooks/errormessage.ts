import { type TRPCClientErrorLike } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useMemo } from "react";
import { type AppRouter } from "../../server/trpc/router/_app";

type Opts = {
  notFoundMessage: string;
};

export const useErrorMessage = (
  error: TRPCClientErrorLike<AppRouter> | null,
  opts: Opts = { notFoundMessage: "Not found" },
) => {
  const errorMessage = useMemo(() => {
    switch (error?.data?.code) {
      case "NOT_FOUND":
        return opts.notFoundMessage;
      case "UNAUTHORIZED":
        signIn();
        break;
      case undefined:
      case null:
        return undefined;
      case "INTERNAL_SERVER_ERROR":
      default:
        return "Something happened on our end :(";
    }
  }, [error, opts]);

  return errorMessage;
};
