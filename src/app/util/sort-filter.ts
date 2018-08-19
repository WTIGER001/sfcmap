import { isArray } from "util";

export class SortFilterUtil {
  static sortAndFilter(items: any[], config: SortFilterData) {
    const filtered = this.filter(items, config)
    const sorted = this.sort(filtered, config)
    if (config.indexed) {
      config.calcIndex(sorted)
    }
    return sorted
  }

  static filter(items: any[], config: SortFilterData): any[] {
    const filtered = items.filter(item => config.matchItem(item))
    return filtered;
  }

  static sort(items: any[], config: SortFilterData): any[] {
    if (!config.sortField) {
      return items;
    }
    return items.sort((a, b) => this.compare(a, b, config))
  }

  static compare(a, b, config: SortFilterData): number {
    const a1 = this.getValue(a, config.sortField)
    const b1 = this.getValue(b, config.sortField)
    return this.compareField(a1, b1, config.sortField.compareFn) * config.direction
  }

  static compareField(a1, b1, compareFn?: (a, b) => number): number {
    if (compareFn) {
      return compareFn(a1, b1)
    } else if (typeof (a1) == 'string') {
      if (a1 < b1) return -1;
      if (a1 > b1) return 1;
      return 0;
    } else if (typeof (a1) == 'number') {
      if (a1 < b1) return -1;
      if (a1 > b1) return 1;
      return 0;
    } else {
      return 0;
    }
  }

  static matchText(txt: string, filter: string): boolean {
    if (filter.startsWith("$")) {
      return txt.toLowerCase().startsWith(filter.substr(1).toLowerCase())
    } else if (filter.startsWith("=")) {
      return txt.toLowerCase() == filter.substr(1).toLowerCase()
    }
    return txt.toLowerCase().includes(filter.toLowerCase())
  }

  static getValue(item: any, field: SortFilterField): any {
    if (field.valueFn) {
      return field.valueFn(item)
    }
    return item[field.name]
  }

  static getIndexValue(item: any, field: SortFilterField): any {
    if (field.indexFn) {
      return field.indexFn(item)
    }
    return this.getValue(item, field)
  }

  static formatItem(item: any, field: SortFilterField): any {
    return this.format(this.getValue(item, field), field)
  }

  static format(value: any, field: SortFilterField): any {
    if (field.formatFn) {
      return field.formatFn(value)
    }
    return value
  }

  static comparefld(a, b, field: SortFilterField): number {
    return this.compareField(a, b, field.compareFn)
  }
}

export interface SortFilterField {
  /** Name of the field */
  name: string
  /** Function to get the value of the field from an item */
  valueFn?: (item) => any
  /** Function to get the Index value of the field */
  indexFn?: (value) => any
  /** Function to get the display value of the field */
  formatFn?: (value) => string
  /** Function to compare 2 values */
  compareFn?: (a, b) => number

  text?: boolean
  filter?: boolean
  sort?: boolean
}

export class SortData {
  field: string;
  direction: number;
  compareFn: (a, b) => number
}

export class SortFilterData {

  _fields: SortFilterField[] = []
  filterFields: SortFilterField[] = []
  sortFields: SortFilterField[] = []
  textFields: SortFilterField[] = []

  textfilter = ''
  sortField: SortFilterField
  direction: number;
  indexValues = []

  // textFields: string[] = []
  filters: Map<SortFilterField, Map<any, boolean>> = new Map()
  indexed: boolean = true;

  set fields(flds: SortFilterField[]) {
    this._fields = flds;
    this.filterFields = flds.filter(f => f.filter)
    this.sortFields = flds.filter(f => f.sort)
    this.textFields = flds.filter(f => f.text)
  }

  get fields(): SortFilterField[] {
    return this._fields
  }

  clear() {
    this.filters.clear()
  }

  calcFilterValues(items: any[]): any {
    this.filters.clear()
    if (this.fields) {
      this.fields.forEach(filterField => {
        if (filterField.filter) {
          items.forEach(item => {
            this.add(filterField, item)
          })
        }
      })
    }
  }

  calcIndex(items: any[]) {

    const indexItems = []
    const m = new Map<any, boolean>()
    if (this.sortField && items) {
      items.forEach(v => {
        const indexValue = SortFilterUtil.getIndexValue(v, this.sortField)
        if (!m.has(indexValue)) {
          m.set(indexValue, true)
        }
      })
      m.forEach((v, k) => indexItems.push(k))
      this.indexValues = indexItems.sort((a, b) => SortFilterUtil.compareField(a, b))
    } else {
      this.indexValues = []
    }
  }

  matchItem(item): boolean {
    let result = true;
    // Field Filters are mandatory
    this.filters.forEach((values, field) => {
      const fieldValue = SortFilterUtil.getValue(item, field)
      const fieldResult = this.matches(fieldValue, field)
      result = result && fieldResult
    })

    // Text filters within
    if (result) {
      result = this.textMatch(item)
    }

    return result;
  }

  /**
   * The Text Match looks for any field that matches (OR)
   * @param item Item to match
   */
  textMatch(item): boolean {
    const textFields = this.fields.filter(f => f.text)
    if (!textFields || textFields.length == 0 || this.textfilter == '') {
      return true;
    }

    let parts = this.textfilter.split(":")
    let fName = parts[0].toLowerCase()
    let searchFilter = parts.length > 1 ? parts[1] : parts[0]
    for (let i = 0; i < textFields.length; i++) {
      const fieldName = textFields[i]
      if (parts.length == 1 || fieldName.name.toLowerCase() == fName) {
        if (this.textMatchField(item, fieldName, searchFilter)) {
          return true;
        }
      }
    }
    return false
  }

  textMatchField(item, field: SortFilterField, filter: string): boolean {
    let value = SortFilterUtil.formatItem(item, field)
    if (value) {
      return SortFilterUtil.matchText(value, filter)
    }
    return false
  }

  fieldValue(item, field: string): any {
    return item[field]
  }

  matches(value: any, field: string | SortFilterField): boolean {
    const fld = this.toField(field)
    let vals = this.filters.get(fld)
    if (vals) {
      return vals.get(value)
    }
    return false;
  }

  add(filter: SortFilterField, item: any) {
    let vals = this.filters.get(filter)
    const value = SortFilterUtil.getValue(item, filter)
    if (!vals) {
      vals = new Map<string, boolean>()
      this.filters.set(filter, vals)
    }
    if (isArray(value)) {
      value.forEach(v => {
        this.add(filter, v)
      })
    } else {
      if (!vals.has(value)) {
        vals.set(value, true)
      }
    }
  }

  toField(field: string | SortFilterField): SortFilterField {
    if (typeof (field) == "string") {
      return this.fields.find(f => f.name.toLowerCase() == field)
    }
    return field
  }

  toggle(field: string | SortFilterField, value: any) {
    const fld = this.toField(field)
    let data = this.filters.get(fld)
    if (data) {
      if (data.has(value)) {
        data.set(value, !data.get(value))
      } else {
        data.set(value, true)
      }
    } else {
      this.add(fld, value)
    }
  }

  toggleAll(field: string | SortFilterField) {
    const fld = this.toField(field)
    let data = this.filters.get(fld)
    if (data) {
      // Check to see if ALL the fields are true or false. If they are all one value then just toggle that value otehr wise set everything to true
      let value = undefined;
      let allSame = undefined;
      data.forEach(v => {
        if (value == undefined) {
          value = v
          allSame = true
        } else if (value != v) {
          allSame = false
        }
      })

      if (allSame) {
        value = !value
      } else {
        value = true
      }
      data.forEach((v, k) => {
        data.set(k, value)
      })
    }
  }

  copyFrom(current: SortFilterData): any {
    this.textfilter = current.textfilter
    this.fields = current.fields.slice(0)
    this.indexed = current.indexed
    this.indexValues = current.indexValues.slice(0)
    this.direction = current.direction
    this.sortField = current.sortField

    current.filters.forEach((v, k) => {
      let m = new Map<string, boolean>()
      this.filters.set(k, m)
      v.forEach((v, k) => {
        m.set(k, v)
      })
    })
  }

  get(field: string | SortFilterField): Map<string, boolean> {
    const fld = this.toField(field)
    return this.filters.get(fld)
  }

  values(field: string | SortFilterField): string[] {
    const fld = this.toField(field)
    let vals = this.filters.get(fld)
    if (vals) {
      let items: string[] = []
      vals.forEach((v, k) => {
        items.push(k)
      })
      return items.sort()
    }
    return []
  }

  value(field: string | SortFilterField, value: any): boolean {
    const fld = this.toField(field)
    let vals = this.filters.get(fld)
    if (vals) {
      return vals.get(value)
    }
    return false
  }
}