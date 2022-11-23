import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import dayjs from "dayjs";
import { TRPCError } from "@trpc/server";
import { nanoid } from "../../common/idutil";

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
          slug: nanoid(),
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
    return allGroups.map((group) => ({
      ...group,
      memberWishlists: group.memberWishlists.length,
    }));
  }),
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const group = await ctx.prisma.secretSantaGroup.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          memberWishlists: {},
        },
      });

      if (!group) {
        return new TRPCError({
          code: "NOT_FOUND",
        });
      } else if (
        !group?.memberWishlists.map((wl) => wl.userId).includes(user.id)
      ) {
        return new TRPCError({
          code: "UNAUTHORIZED",
        });
      } else {
        return group;
      }
    }),
});
