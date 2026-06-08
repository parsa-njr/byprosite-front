// Generic setter type
export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

// Shared base entities
export interface Province {
  id: number;
  name: string;
}

export interface County {
  id: number;
  name: string;
  provinceId: number;
}

export interface City {
  id: number;
  name: string;
  countyId: number;
}
