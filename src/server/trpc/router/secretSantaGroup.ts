import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import dayjs from "dayjs";

export const secretSantaGroupRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().max(100),
        emails: z.array(z.string().email()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentYear = dayjs().year();
      const group = await ctx.prisma.secretSantaGroup.create({
        data: {
          name: input.name,
          year: currentYear,
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
      await ctx.prisma.wishlist.create({
        data: {
          userId: ctx.session.user.id,
          secretSantaGroupId: group.id,
        },
      });
      return group;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const allGroups = await ctx.prisma.secretSantaGroup.findMany({
      where: { ownerId: user.id },
      include: {
        memberWishlists: true,
      },
    });
    ctx.logger.info("secretSantaGroup created");
    return allGroups.map((group) => ({
      ...group,
      memberWishlists: group.memberWishlists.length,
    }));
  }),
});
