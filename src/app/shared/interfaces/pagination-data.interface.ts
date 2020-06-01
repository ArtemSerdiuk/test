import { PaginationApi } from './pagination-api.interface';
import { GifApi } from './gif-api.interface';

export interface PaginationData {
  data: GifApi[];
  pagination: PaginationApi;
}
