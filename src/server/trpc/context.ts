import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { type Logger } from "pino";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import { logger as baseLogger } from "../logger";

type CreateContextOptions = {
  session: Session | null;
  logger: Logger;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    logger: opts.logger,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });
  const logger = baseLogger.child({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reqId: (req as any).id,
    userId: session?.user?.id,
  });
  return await createContextInner({
    session,
    logger,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
