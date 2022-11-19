import superjson from "superjson";
import { type GetServerSidePropsContext } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../server/trpc/router/_app";
import { createContext } from "../server/trpc/context";

// Helper to use trpc serverside to prefetch data
export const createTrpcSsr = async (ctx: GetServerSidePropsContext) => {
  return createProxySSGHelpers({
    router: appRouter,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: await createContext(ctx as any),
    transformer: superjson,
  });
};
