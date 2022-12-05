import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { secretSantaGroupRouter } from "./secretSantaGroup";
import { wishlistRouter } from "./wishlist";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  secretSantaGroup: secretSantaGroupRouter,
  wishlist: wishlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
