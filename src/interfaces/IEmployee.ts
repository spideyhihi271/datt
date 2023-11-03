import { Gender } from "./Enum";

export interface IEmployee {
  name: string;
  birth: number;
  gender: Gender;
  address: string;
  phone: string;
}

export interface IEmployeeUpdate {
  name?: string;
  birth?: number;
  gender?: Gender;
  address?: string;
  phone?: string;
}
