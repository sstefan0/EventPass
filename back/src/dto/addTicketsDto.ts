export interface AddTicketsDto {
  EventId: string;
  TicketTypeId: string;
  Price: number;
  Description: string | null;
  Amount: number;
}
