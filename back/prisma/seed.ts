import { prisma } from "../src/util/prisma-client";
import { Role, CountryCode } from "@prisma/client";
import seedData from "./seed-data.json";

const users = seedData.user.map((user) => ({
  ...user,
  Role: user.Role == "USER" ? Role.USER : Role.ORGANIZER,
}));
const cities = seedData.city.map((city) => ({
  ...city,
  Country: city.Country as CountryCode,
}));

async function main() {
  //delete
  await prisma.user.deleteMany();
  await prisma.eventTicket.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.city.deleteMany();

  //create
  await prisma.user.createMany({ data: users });
  await prisma.ticketType.createMany({ data: seedData.ticketType });
  await prisma.city.createMany({ data: cities });
  await prisma.event.createMany({ data: seedData.event });
  await prisma.eventTicket.createMany({ data: seedData.eventTickets });
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
