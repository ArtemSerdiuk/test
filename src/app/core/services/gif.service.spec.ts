import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { GifService } from './gif.service';
import { PaginationData } from '../../shared/interfaces/pagination-data.interface';
import { ApiConfig } from '../general/api-config';
import { environment } from '../../../environments/environment';
import { Item } from '../../shared/interfaces/item.interface';


const mockGifsData: PaginationData = {
  data: [
    {
      title: 'test',
      images: {
        fixed_height: {
          url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N',
        }
      },
    },
  ],
  pagination: {
    total_count: 1,
    count: 1,
    offset: 0,
  }
};

const testUrl = `${ApiConfig.searchPath}?api_key=${environment.apiKey}`;

const mockResultData: Item = {
  data: [{
    title: 'test',
    url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N',
  }],
  pagination: {
    total: 1,
    count: 1,
    offset: 0,
  }
};

describe('GifService', () => {

  let httpMock: HttpTestingController;
  let gifService: GifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ GifService ]
    });

    gifService = TestBed.inject(GifService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should have a service instance', () => {
    expect(GifService).toBeDefined();
  });

  it('searchGifs() should return gifs data', () => {

    gifService.searchGifs({}).subscribe((res) => {
      expect(res).toEqual(mockResultData);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockGifsData);

    httpMock.verify();
  });

  it('should return an error when the server returns a 404', () => {
    const errorMessage: string = 'test 404 error';
    const mockErrorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    gifService.searchGifs({}).subscribe(
      () => fail,
      (error: HttpErrorResponse)  => {
        expect(error.error).toEqual(errorMessage, 'test 404 error');
        expect(error.status).toEqual(404, 'status');
      }
    );

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(errorMessage, mockErrorResponse);
  });

  it('test network error', () => {
    const errorMessage: string = 'simulated network error';

    gifService.searchGifs({}).subscribe(
      () => fail,
      (error: HttpErrorResponse) => {
        expect(error.error.message).toEqual(errorMessage, 'message');
      }
    );

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');

    const mockError = new ErrorEvent('Network error', {
      message: errorMessage,
    });

    req.error(mockError);
  });
});
