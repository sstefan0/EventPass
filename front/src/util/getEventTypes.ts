import callApi from "../api/api";

export const getEventTypes = async () => {
  try {
    const response = await callApi.Event.types();
    return response;
  } catch (error) {
    console.error(error);
  }
};
