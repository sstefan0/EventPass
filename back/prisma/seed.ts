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
  const deleteUsers = prisma.user.deleteMany();
  const deleteTicketTypes = prisma.ticketType.deleteMany();
  const deleteCities = prisma.city.deleteMany();
  const deleteEventTypes = prisma.eventType.deleteMany();
  await prisma.purchase.deleteMany();

  await Promise.allSettled([
    deleteUsers,
    deleteCities,
    deleteTicketTypes,
    deleteEventTypes,
  ]);

  const createUsers = prisma.user.createMany({ data: users });
  const createTicketTypes = prisma.ticketType.createMany({
    data: seedData.ticketType,
  });
  const createCities = prisma.city.createMany({ data: cities });
  const createEventTypes = prisma.eventType.createMany({
    data: seedData.eventType,
  });
  const createEvents = prisma.event.createMany({ data: seedData.event });
  const createTickets = prisma.eventTicket.createMany({
    data: seedData.eventTickets,
  });

  await Promise.allSettled([
    createUsers,
    createTicketTypes,
    createCities,
    createEventTypes,
  ]);
  await createEvents;
  await createTickets;
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
