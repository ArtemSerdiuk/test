import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { GifService } from '../core/services/gif.service';
import { Gif } from '../shared/interfaces/gif.interface';
import { DataTransform } from '../core/helpers/data-transform';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit, OnDestroy  {
  public gifs: Gif[];
  public pageSize: number = 9;
  public totalCountItems: number;
  public currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public search: FormControl = new FormControl('');
  public isError: boolean;
  public isLoading: boolean;
  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private gifService: GifService,
  ) {
  }

  public ngOnInit(): void {
    this.getSearchGifs();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }


  public setCurrentPageCount(count: number): void {
    this.currentPage$.next(count);
  }


  public getSearchGifs(): void {
    combineLatest([
      this.searchChanges(),
      this.paginationChanges(),
    ])
      .pipe(
        map(([value, currentPage]) => DataTransform.searchDataTransform(value, currentPage, this.pageSize)),
        tap(() => {
          this.isError = false;
          this.isLoading = true;
        }),
        switchMap(params => this.gifService.searchGifs(params)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(res => {
        this.totalCountItems = res.pagination.total;
        this.gifs = res.data;
        this.isLoading = false;
      },
      (error: Error) => {
        this.isError = true;
        this.isLoading = false;
        console.error(error.message);
      }
      );
  }

  public searchChanges(): Observable<string> {
    return this.search.valueChanges.pipe(
      map((value: string[]) => value.join(' ')),
      distinctUntilChanged(),
      tap(() => this.setPagination(1))
    );
  }

  public paginationChanges(): Observable<number> {
    return this.currentPage$.pipe(distinctUntilChanged());
  }


  public setPagination(value: number): void {
    return this.currentPage$.next(value);
  }

}
