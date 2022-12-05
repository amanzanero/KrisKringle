import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const getBySlug = protectedProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ ctx, input }) => {
    const wishlist = await ctx.prisma.wishlist.findUnique({
      where: { slug: input.slug },
      include: {
        secretSantaGroup: {
          select: {
            slug: true,
            memberWishlists: { select: { userId: true } },
            name: true,
          },
        },
        entries: {
          orderBy: { createdAt: "desc" },
        },
        user: true,
      },
    });

    if (!wishlist) {
      throw new TRPCError({ code: "NOT_FOUND" });
    } else if (
      !wishlist.secretSantaGroup.memberWishlists
        .map((wl) => wl.userId)
        .includes(ctx.session.user.id)
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return wishlist;
  });

export const createEntry = protectedProcedure
  .input(
    z.object({
      link: z.string().optional(),
      description: z.string(),
      priceUsd: z.number().positive(),
      wishlistId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // ensure user owns wishlist
    const wishlist = await ctx.prisma.wishlist.findUnique({
      where: { id: input.wishlistId },
    });
    if (!wishlist) {
      throw new TRPCError({ code: "NOT_FOUND" });
    } else if (wishlist.userId != ctx.session.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const entry = await ctx.prisma.wishlistEntry.create({
      data: {
        description: input.description,
        link: input.link,
        wishlistId: input.wishlistId,
        price: input.priceUsd,
      },
    });
    return entry;
  });

const deleteItemFromWishlist = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const entry = await ctx.prisma.wishlistEntry.findUnique({
      where: { id: input.id },
      include: { wishlist: true },
    });
    if (!entry) {
      throw new TRPCError({ code: "NOT_FOUND" });
    } else if (entry.wishlist.userId != ctx.session.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    await ctx.prisma.wishlistEntry.delete({ where: { id: input.id } });
    return;
  });

export const wishlistRouter = router({
  getBySlug,
  createEntry,
  deleteItemFromWishlist,
});
