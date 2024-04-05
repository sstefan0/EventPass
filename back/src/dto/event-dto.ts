export interface AddTicketsDto {
  EventId: string;
  TicketTypeId: string;
  Price: number;
  Description: string | null;
  Amount: number;
}

export interface CreateEventDto {
  Title: string;
  Description: string;
  DateTime: Date;
  Location: string;
  cityId: string;
  eventTypeId: string;
  ImageUrl: string;
}

export interface DeleteDto {
  id: string;
}

export interface UpdateEventDto {
  Id: string;
  Title: string;
  Description: string;
  DateTime: Date;
  Location: string;
  cityId: string;
  ImageUrl: string;
}

export interface GetEventDto {
  id: string;
}

export interface GetEventsDto {
  startDate: Date | null;
  endDate: Date | null;
  countryCode: string | null;
  cityId: string | null;
  eventTypeId: string | null;
}
