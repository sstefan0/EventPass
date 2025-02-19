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
export interface DeleteTicketsDto {
  tickets: string[];
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
  id: string | null;
}
