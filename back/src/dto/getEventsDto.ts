export interface GetEventsDto {
  startDate: Date | null;
  endDate: Date | null;
  countryCode: string | null;
  cityId: string | null;
  eventTypeId: string | null;
}
