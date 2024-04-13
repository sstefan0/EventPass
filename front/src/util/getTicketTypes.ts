import callApi from "../api/api";

export const getEventTicketTypes = async () => {
  try {
    const response = await callApi.Event.ticketTypes();
    return response;
  } catch (error) {
    console.error(error);
  }
};
