import type { PrismaClient } from "../../generated/prisma/client";
import { DEFAULT_ENERGY_TYPES } from "../../domain/energy/default-energy-types";

export const DEVELOPMENT_USER_ID = "00000000-0000-4000-8000-000000000001";

export async function ensureDevelopmentUser(client: PrismaClient) {
  const user = await client.user.upsert({
    where: { id: DEVELOPMENT_USER_ID },
    update: {},
    create: {
      id: DEVELOPMENT_USER_ID,
      name: "Local development user",
    },
  });

  await client.energyType.createMany({
    data: DEFAULT_ENERGY_TYPES.map(({ name, sortOrder }) => ({
      userId: user.id,
      name,
      sortOrder,
      isDefault: true,
    })),
    skipDuplicates: true,
  });

  return user;
}