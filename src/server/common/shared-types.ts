import { z } from "zod";

export const createEntryInput = z.object({
  link: z.string().optional(),
  description: z.string(),
  priceUsd: z.number().positive(),
  wishlistId: z.string(),
});
