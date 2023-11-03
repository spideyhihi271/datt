import { IPaginationParams } from "./IPagination";

export interface IParamsGetFile extends IPaginationParams {
  q?: string;
  status?: string;
  type?: string;
  sort?: string;
}

export interface IParamsGetEquid extends IPaginationParams {
  q?: string;
  sort?: string;
}

export interface IParamsGetMonitory extends IPaginationParams {
  q?: string;
  sort?: string;
}
