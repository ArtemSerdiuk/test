import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfig } from '../general/api-config';
import { PaginationData } from '../../shared/interfaces/pagination-data.interface';
import { DataTransform } from '../helpers/data-transform';
import { GifApi } from '../../shared/interfaces/gif-api.interface';
import { Item } from '../../shared/interfaces/item.interface';

@Injectable({
  providedIn: 'root',
})
export class GifService {

  constructor(public http: HttpClient) {
  }

  public searchGifs(params: { [key: string]: string }): Observable<Item> {
    const requestParams = { api_key: ApiConfig.apiKey, ...params};

    return this.http.get<PaginationData>(`${ApiConfig.searchPath}`, {params: requestParams})
      .pipe(
        map((res: PaginationData) => {
          const transformData = res.data.map((item: GifApi) => DataTransform.gifDataTransform(item));
          return {
            data: transformData,
            pagination: DataTransform.paginationDataTransform(res.pagination),
          };
        }),
      );
  }
}
