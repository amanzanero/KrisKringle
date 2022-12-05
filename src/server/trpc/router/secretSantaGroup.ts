import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import dayjs from "dayjs";
import { TRPCError } from "@trpc/server";
import { nanoid } from "../../common/idutil";

const create = protectedProcedure
  .input(z.object({ name: z.string().max(100), limit: z.number() }))
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
  });

const join = protectedProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const group = await ctx.prisma.secretSantaGroup.findUnique({
      where: { slug: input.code },
      include: { memberWishlists: { select: { userId: true } } },
    });
    if (!group) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const existingWishlist = group.memberWishlists.find((wishlist) => {
      return wishlist.userId === ctx.session.user.id;
    });
    if (!!existingWishlist) {
      // already joined this secret santa group
      return group;
    }

    // create a wishlist and add it
    await ctx.prisma.wishlist.create({
      data: { userId: ctx.session.user.id, secretSantaGroupId: group.id },
      select: {},
    });
    return group;
  });

const getAll = protectedProcedure.query(async ({ ctx }) => {
  const user = ctx.session.user;
  const allGroups = await ctx.prisma.secretSantaGroup.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { memberWishlists: { some: { userId: user.id } } },
      ],
    },
    include: { memberWishlists: true },
  });
  return allGroups.map((group) => ({
    ...group,
    memberWishlists: group.memberWishlists.length,
  }));
});

const getBySlug = protectedProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const group = await ctx.prisma.secretSantaGroup.findUnique({
      where: { slug: input.slug },
      include: {
        memberWishlists: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
        owner: true,
      },
    });
    if (!group) {
      throw new TRPCError({ code: "NOT_FOUND" });
    } else if (
      !group?.memberWishlists.map((wl) => wl.userId).includes(user.id)
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return group;
  });

export const secretSantaGroupRouter = router({
  create,
  join,
  getAll,
  getBySlug,
});
