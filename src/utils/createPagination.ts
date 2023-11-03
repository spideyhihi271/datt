import { IPagination } from "interfaces/IPagination";

export default function createPagination(
  data: any[],
  total: number,
  defaultLimit: number,
  params: any
) {
  const result: IPagination = {
    data,
    pagination: {
      page: params.page ? parseInt(params.page) : 1,
      total,
      limit: params.limit ? params.limit : defaultLimit,
    },
  };
  return result;
}
