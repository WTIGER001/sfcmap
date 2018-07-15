import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  private changed = [];
  private touched = [];
  _value: any = '';

  get value(): any {
    return this._value;
  };

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.changed.forEach(f => {
        f(v)
      });
      this.refresh()
    }
  }

  writeValue(value: any) {
    this._value = value;
    this.refresh()
  }

  abstract refresh()

  registerOnChange(fn: any): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: any): void {
    this.touched.push(fn);
  }
}

export function MakeProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}