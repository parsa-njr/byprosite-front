// AddressTypes.ts

export type AddressType =
  | "Habitat"
  | "HeadOffice"
  | "Company"
  | "SalesOffice"
  | "Cellar"
  | "Work"
  | "Other";

export interface Address {
  addressValue: string;
  addressDescription: string;
  type: AddressType;
  lat: number;
  lng: number;
  isDefault: boolean;
  provinceId: number;
  countyId: number;
  cityId: number;
}

export interface AddressFormValues {
  id?: string;
  isDefault: boolean;
  type: AddressType | null;
  provinceId: number |string | null;
  countyId: number | string | null;
  cityId: number | string | null;
  provinceName : string | null;
  countyName : string | null;
  cityName : string | null;
  lat: number | null;
  lng: number | null;
  addressValue: string;
  addressDescription: string;
}

export interface AddressFormModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  initialValues?: Partial<AddressFormValues> | null;
  onSubmit: (values: AddressFormValues) => void;
  mode?: string | null;
}
