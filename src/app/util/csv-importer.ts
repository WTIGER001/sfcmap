import { ImageSearchResult, GoogleImageSearch } from "./GoogleImageSearch";
import { Asset } from "../models";
import { parse } from "papaparse";
import { removeSummaryDuplicates } from "@angular/compiler";


export abstract class CsvImporter<T extends Asset> {

  abstract hasPictures: boolean
  abstract convertToObject(json): T

  public async load(csvFile: File, loadPictures?: boolean, start?: number, count?: number): Promise<T[]> {

    count = count == 0 ? 100000 : count
    const obj = await this.parse2(csvFile)



    const results: T[] = []

    obj.data.forEach(d => {
      const obj = this.convertToObject(d)
      if (obj) {
        results.push(obj)
      }
    })


    const sliced = results.slice(start, count)
    if (this.hasPictures && loadPictures) {
      await this.getRandomPictures(sliced)
    }

    return sliced
  }

  public static toBoolean(input: string): boolean {
    if (!input || input == '') { return false }
    if (input.trim() == '0') { return false }
    if (input.trim() == '1') { return true }
    return false
  }

  public static toInt(input: string): number {
    let a = parseInt(input)
    if (isNaN(a)) {
      a = 0
    }
    return a
  }

  public static multiNumber(input: string): number[] {
    const exp = /[\d-]*/g
    const matches = input.match(exp)
    const arr: number[] = []
    matches.forEach(m => {
      if (m.length > 0 && m != "-") {
        arr.push(parseInt(m))
      }
    })

    return arr
  }

  async getRandomPictures(items: T[]) {
    for (let ind = 0; ind < items.length; ind++) {
      const i = items[ind]
      const term = this.getSearchTerm(i)
      const r: ImageSearchResult[] = await GoogleImageSearch.searchImage(term)
      i['image'] = r[0].url
      i['thumb'] = r[0].thumb
    }
  }


  getSearchTerm(item: T) {
    return item.name + " fantasy art"
  }

  parse2(csvFile: File): Promise<any> {
    return new Promise((resolve, reject) => {
      parse(csvFile, {
        header: true,
        complete: resolve
      });
    })
  }
}