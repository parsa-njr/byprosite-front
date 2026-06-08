import { Setter } from "./common";
import { AddressFormValues } from "./address";

// ---- Auth flow ----
export type AuthMode = "signUp" | "login" | "forgetPassword";

export interface EnterPhoneProps {
  setPage: Setter<number>;
  mode?: AuthMode; // default = "signUp"
  setPhoneNumber?: Setter<string | null>;
  phoneNumber?: string | null;
}

export interface VerifyOtpProps {
  setPage: Setter<number>;
  mode?: AuthMode;
  phoneNumber: string | null;
  setUserId?: Setter<string | null>; // optional, only needed in signUp
}

// ---- Enums ----
export enum CustomerLegalStatus {
  Individual = "Individual",
  LegalEntity = "LegalEntity",
}

export enum ActivityType {
  Buyer = "Buyer",
  Seller = "Seller",
  BuyerAndSeller = "BuyerAndSeller",
}

// ---- Sign Up Form ----
export interface SignUpFormValues {
  userId: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  companyManageName?: string;
  companyManageFamily?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  activityType?: ActivityType | "";
  customerLegalStatus?: CustomerLegalStatus | "";
}

// ---- Level Two Sign Up ----
export interface Category {
  categoryId: string | number;
  groupIds: number[];
}

export interface LevelTwoSignUpFormValues {
  meliCode: string;
  email: string;
  shebaNumber: string;
  bankId: number;
  groupIds: number[];
  categories: Category[];
  addresses: AddressFormValues[];
}

export interface LevelTwoSignUpRequest {
  meliCode: string;
  email: string;
  // shebaNumber: string;
  // bankId: number;
  groupIds: number[];
  addresses: AddressFormValues[];
}

// ---- Login ----
export interface LoginWithPasswordFormValues {
  phoneNumber: string;
  password: string;
  isPersistent: boolean;
}

export interface LoginWithPasswordRequest {
  phoneNumber: string;
  password: string;
  code: string;
  isPersistent: boolean;
}

export interface LoginWithPasswordProps {
  setPage: Setter<number>;
  setPhoneNumber?: Setter<string | null>;
}
