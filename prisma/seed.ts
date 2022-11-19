/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.findUnique({
    where: { email: "manzanero.andrew@gmail.com" },
  });
  const user2 = await prisma.user.create({ data: { name: "John Doe" } });
  const user3 = await prisma.user.create({ data: { name: "Jane Doe" } });
  const mainGroup = await prisma.secretSantaGroup.create({
    data: {
      ownerId: user1!.id,
      name: "secret santa 2022",
      year: 2022,
    },
  });
  const mainAssignment1 = await prisma.secretSantaGroupOnWishlist.create({
    data: { gifterId: user1!.id, secretSantaGroupId: mainGroup.id },
  });
  const mainAssignment2 = await prisma.secretSantaGroupOnWishlist.create({
    data: { gifterId: user2.id, secretSantaGroupId: mainGroup.id },
  });
  const mainAssignment3 = await prisma.secretSantaGroupOnWishlist.create({
    data: { gifterId: user3.id, secretSantaGroupId: mainGroup.id },
  });
  await prisma.wishlist.create({
    data: {
      userId: user1!.id,
      secretSantaGroupId: mainGroup.id,
      secretSantaGroupOnWishlistId: mainAssignment1.id,
    },
  });
  await prisma.wishlist.create({
    data: {
      userId: user2!.id,
      secretSantaGroupId: mainGroup.id,
      secretSantaGroupOnWishlistId: mainAssignment2.id,
    },
  });
  await prisma.wishlist.create({
    data: {
      userId: user3.id,
      secretSantaGroupId: mainGroup.id,
      secretSantaGroupOnWishlistId: mainAssignment3.id,
    },
  });

  // doesnt include user1
  const otherGroup = await prisma.secretSantaGroup.create({
    data: {
      ownerId: user2!.id,
      name: "GROUP I SHOULDNT SEE",
      year: 2022,
    },
  });
  const otherAssignment2 = await prisma.secretSantaGroupOnWishlist.create({
    data: { gifterId: user2.id, secretSantaGroupId: otherGroup.id },
  });
  const otherAssignment3 = await prisma.secretSantaGroupOnWishlist.create({
    data: { gifterId: user3.id, secretSantaGroupId: otherGroup.id },
  });
  await prisma.wishlist.create({
    data: {
      userId: user2!.id,
      secretSantaGroupId: otherGroup.id,
      secretSantaGroupOnWishlistId: otherAssignment2.id,
    },
  });
  await prisma.wishlist.create({
    data: {
      userId: user3.id,
      secretSantaGroupId: otherGroup.id,
      secretSantaGroupOnWishlistId: otherAssignment3.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
