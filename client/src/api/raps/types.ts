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
}