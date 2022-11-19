import { z } from "zod";

import { publicProcedure, protectedProcedure, router } from "../trpc";
import dayjs from "dayjs";

export const secretSantaGroupRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().max(100),
        emails: z.array(z.string().email()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentYear = dayjs().year();
      const result = await ctx.prisma.secretSantaGroup.create({
        data: {
          name: input.name,
          year: currentYear,
          owner: { connect: { id: ctx.session?.user?.id } },
        },
      });
      return result;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const allGroups = ctx.prisma.secretSantaGroup.findMany({ where: { ownerId: user.id } });
    return await allGroups;
  }),
});
