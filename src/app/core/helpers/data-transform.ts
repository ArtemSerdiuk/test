import { Gif } from '../../share/interfaces/gif.interface';
import { PaginationApi } from '../../share/interfaces/pagination-api.interface';
import { Pagination } from '../../share/interfaces/pagination.interface';
import { GifApi } from '../../share/interfaces/gif-api.interface';

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
