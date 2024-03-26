import { prisma } from "../src/util/prisma-client";
import { Role } from "@prisma/client";
import seedData from "./seed-data.json";

const users = seedData.user.map((user) => ({
  ...user,
  Role: user.Role == "USER" ? Role.USER : Role.ORGANIZER,
}));
async function main() {
  await prisma.user.createMany({ data: users });
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
