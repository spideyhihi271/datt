export interface IPagination {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IPaginationParams {
  limit?: string;
  page?: string;
}
