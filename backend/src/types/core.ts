export type Product = {
  id: number;
  name: string;
  gvtId: number;
  productTagline: string;
  shortDescription: string;
  longDescription: string;
  logoLocation: string;
  productUrl: string;
  voucherTypeName: string;
  orderUrl: string;
  productTitle: string;
  variableDenomPriceMinAmount?: string;
  variableDenomPriceMaxAmount?: string;
  __typename: string;
};

export type HttpResult<T> = success<T> | failure;

type success<T> = T;

type failure = {
  error: string;
  status: number;
};

export const Success = <T>(data: T): success<T> => data;

export const Failure = (error: string, status: number): failure => ({
  error,
  status: status,
});

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
