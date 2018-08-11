export class GoogleImageSearch {
  static counter = 0
  /**
   * Function for image search
   *
   * @param  {string} query   Image search filed query
   * @return {Promise}        Returns a promise, with an array of found image URL's
   */
  static searchImage(query): Promise<ImageSearchResult[]> {
    query = encodeURIComponent(query)

    return new Promise((resolve, reject) => {

      // Fetches Items from Google Image Search URL
      fetch("https://cors-anywhere.herokuapp.com/https://www.google.com.ua/search?source=lnms&tbm=isch&q=" + query)
        .then(res => res.text())
        .then(res => {

          const results: ImageSearchResult[] = []

          // Transforms HTML string into DOM object
          let parser = new DOMParser()
          let doc = parser.parseFromString(res, "text/html")
          let nodes = doc.getElementsByClassName('rg_meta')
          let thumbNodes = doc.getElementsByClassName('rg_ic')

          for (let i = 0; i < nodes.length; i++) {
            let node = nodes.item(i)
            let text = node.innerHTML.toString().trim()
            let obj = JSON.parse(text)
            let url = obj.ou
            let r = new ImageSearchResult()
            r.url = obj.ou
            r.thumb = (<string>obj.tu).replace("\u003d", "=")
            results.push(r)
          }
          resolve(results)
        })
        .catch(err => reject(err))
    })
  }

}

export class ImageSearchResult {
  url: string
  thumb: string
}