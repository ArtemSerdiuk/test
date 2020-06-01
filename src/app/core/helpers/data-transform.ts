import { Gif } from '../../shared/interfaces/gif.interface';
import { PaginationApi } from '../../shared/interfaces/pagination-api.interface';
import { Pagination } from '../../shared/interfaces/pagination.interface';
import { GifApi } from '../../shared/interfaces/gif-api.interface';

export class DataTransform {

  public static searchDataTransform(value: string, currentPage: number, pageSize: number): any {
    return {
      q: value,
      limit: pageSize.toString(),
      offset: ((currentPage - 1) * pageSize).toString(),
    };
  }

  public static gifDataTransform(data: GifApi): Gif {
    return {
      title: data.title,
      url: data.images.fixed_height.url,
    };
  }

  public static paginationDataTransform(data: PaginationApi): Pagination {
    return {
      total: data.total_count,
      count: data.count,
      offset: data.offset,
    };
  }
}
