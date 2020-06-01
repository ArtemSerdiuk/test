import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { GifSearchComponent } from './gif-search.component';
import { GifService } from '../core/services/gif.service';
import { Item } from '../shared/interfaces/item.interface';

const mockResultData: Item = {
  data: [
    { title: 'test1', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test2', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test3', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test4', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test5', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test6', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test7', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test8', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test9', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
    { title: 'test10', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
  ],
  pagination: {
    total: 10,
    count: 9,
    offset: 0,
  }
};

const mockEmptyResult: Item = {
  data: [],
  pagination: { total: 0, count: 0, offset: 0 },
};

const mockResultSecondPage: Item = {
  data: [
    { title: 'test2', url: 'https://giphy.com/gifs/CryptoUniverseUFE-df-fdf-vfd-E07UWfjhslOi4HmZ1N' },
  ],
  pagination: { total: 10, count: 9, offset: 9 },
};

const mockError = new ErrorEvent('Network error', { message: 'error' });


const gifServiceStub = {
  searchGifs: () => (of(mockResultData)),
};

@Component({
  selector: 'app-multi-tag',
  template: '',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiTagComponent),
    multi: true,
  }],
})
export class MultiTagComponent implements ControlValueAccessor {
  public registerOnChange(): void {
  }

  public registerOnTouched(): void {
  }

  public writeValue(): void {
  }
}

describe('GifSearchComponent', () => {
  let component: GifSearchComponent;
  let fixture: ComponentFixture<GifSearchComponent>;
  let gifService: GifService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GifSearchComponent, MultiTagComponent],
      providers: [{provide: GifService, useValue: gifServiceStub}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifSearchComponent);
    component = fixture.componentInstance;
    gifService = fixture.debugElement.injector.get<GifService>(GifService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should do first search request', fakeAsync(() => {
    spyOn(gifService, 'searchGifs').and.returnValue(of(mockResultData));
    component.search.patchValue(['some_keyword']);
    fixture.detectChanges();
    expect(component.isError).toEqual(false);
    expect(gifService.searchGifs).toHaveBeenCalled();
    expect(component.gifs).toEqual(mockResultData.data);
  }));

  it('should change pagination', fakeAsync(() => {
    const spySearchRequest = spyOn(gifService, 'searchGifs');
    spySearchRequest.and.returnValue(of(mockResultData));
    component.search.patchValue(['some_keyword']);
    spySearchRequest.and.returnValue(of(mockResultSecondPage));
    expect(component.currentPage$.value).toEqual(1);
    component.setCurrentPageCount(2);
    fixture.detectChanges();
    expect(component.isError).toEqual(false);
    expect(component.currentPage$.value).toEqual(2);
    expect(gifService.searchGifs).toHaveBeenCalled();
    expect(component.gifs).toEqual(mockResultSecondPage.data);
  }));

  it('should do search request with empty result', () => {
    spyOn(gifService, 'searchGifs').and.returnValue(of(mockEmptyResult));
    component.search.patchValue(['some_not_availed_keyword']);
    fixture.detectChanges();
    expect(component.isError).toEqual(false);
    expect(gifService.searchGifs).toHaveBeenCalled();
    expect(component.gifs.length).toEqual(0);
    expect(component.search.value.length).toBeGreaterThan(0);
    const alertElement = fixture.debugElement.query(By.css('.alert')).nativeElement;
    expect(alertElement.textContent).toEqual(' No matches found, please try some different terms. ');
  });

  it('should clear search', () => {
    spyOn(gifService, 'searchGifs').and.returnValue(of(mockEmptyResult));
    component.search.patchValue([]);
    fixture.detectChanges();
    expect(component.isError).toEqual(false);
    expect(gifService.searchGifs).toHaveBeenCalled();
    expect(component.gifs.length).toEqual(0);
    expect(component.search.value.length).toEqual(0);
  });

  it('should get API Error on search', () => {
    spyOn(gifService, 'searchGifs').and.returnValue(throwError(mockError));
    component.search.patchValue(['keyword']);
    fixture.detectChanges();
    expect(gifService.searchGifs).toHaveBeenCalled();
    expect(component.gifs).toEqual(undefined);
    expect(component.isError).toEqual(true);
    const alertElement = fixture.debugElement.query(By.css('.alert')).nativeElement;
    expect(alertElement.textContent).toEqual(' Something went wrong, please try again. ');
  });
});
