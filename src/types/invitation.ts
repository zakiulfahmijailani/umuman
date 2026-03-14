export interface PersonDetails {
  fullName: string;
  father: string;
  mother: string;
  photo: string;
}

export interface QuoteDetails {
  text: string;
  source: string;
}

export interface EventDetails {
  date: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface DressCodeDetails {
  description: string;
  colors: string[];
}

export interface LoveStoryDetails {
  date: string;
  title: string;
  description: string;
  photo: string;
}

export interface BankAccountDetails {
  bank: string;
  number: string;
  name: string;
}

export interface RsvpMessageDetails {
  name: string;
  attendance: "hadir" | "tidak_hadir" | "ragu" | string;
  message: string;
  createdAt: string;
}

export interface InvitationData {
  coupleShortName: string;
  groom: PersonDetails;
  bride: PersonDetails;
  coverPhoto: string;
  heroPhoto: string;
  quote: QuoteDetails;
  akad: EventDetails;
  reception: EventDetails;
  dressCode?: DressCodeDetails;
  loveStory?: LoveStoryDetails[];
  gallery?: string[];
  bankAccounts?: BankAccountDetails[];
  giftAddress?: string;
  rsvpMessages?: RsvpMessageDetails[];
  calendarUrl?: string;
}
