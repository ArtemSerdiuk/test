import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { noop, Subject } from 'rxjs';

@Component({
  selector: 'app-multi-tag',
  templateUrl: './multi-tag.component.html',
  styleUrls: ['./multi-tag.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiTagComponent),
    multi: true,
  }]
})
export class MultiTagComponent implements  ControlValueAccessor {

  @Input()
  public placeholder: string;

  public control: FormControl = new FormControl();
  public searchTags: string[] = [];
  public isFocused$: Subject<boolean> = new Subject<boolean>();

  private onChange: any = noop;
  private onTouched: any = noop;

  public writeValue(value: string[]): void {
    if (value && value.length > 0) {
      this.searchTags = value;
    } else {
      this.searchTags = [];
      this.control.reset('');
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public addTag(input: HTMLInputElement): void {
    const value = input.value;

    if ((value || '').trim()) {
      this.searchTags.push(value.trim());
      this.onChange(this.searchTags);
    }

    if (input) {
      input.value = '';
    }
  }

  public removeTag(tag: string): void {
    const index = this.searchTags.indexOf(tag);

    if (index >= 0) {
      this.searchTags.splice(index, 1);
      this.onChange(this.searchTags);
    }
  }

  public removeAllTags(): void {
    this.control.reset('');
    this.searchTags = [];
    this.onChange(this.searchTags);
  }

  public focusTrigger(isFocused: boolean): void {
    this.isFocused$.next(isFocused);
  }
}
