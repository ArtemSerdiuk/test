import { Gif } from './gif.interface';
import { Pagination } from './pagination.interface';

export interface Item {
  data: Gif[];
  pagination: Pagination;
}
