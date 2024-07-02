export interface Rap {
  id: string
  title: string
  lyrics?: string
  rapper: string
  bonus: boolean
  imageUrl: string
  appearedAt: Event
}

export interface Event {
  name: EventName
  series: number
}

export enum EventName {
  BSDAC = 'BSDAC',
  BEATS = 'BEATS',
  CBB = "Cam's Birthday Bash"
}

export const getEventLabel = (event: Event): string => `${event.name}${event.series > 0 ? ` ${event.series}` : ''}`