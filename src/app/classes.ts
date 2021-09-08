export interface Customer {
  id: number,
  name: string,
  contact: string,
  address: string,
  city: string,
  postalcode: string,
  country: string
}

export interface EntryHeader {
  name: string;
  width: number;
}

export const InputField = {
  Text: 0,
  Number: 1,
  Date: 2,
  Reference: (query: string) => query
}

