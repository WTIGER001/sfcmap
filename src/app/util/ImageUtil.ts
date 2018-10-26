import { ReplaySubject, Observable, Subscriber, Subject } from "rxjs";
import { LatLngBounds } from "leaflet";
import { Rect } from "./geom";

export class ImageResult {
  height: number
  width: number
  thumb: Blob
  thumbHeight: number
  thumbWidth: number
  image: Blob
  dataURL: string
  file: File
  aspect: number // just w/h
}

export interface LoadImageOptions {
  // maxWidth?: number
  // maxHeight?: number
  // keepAspect?: boolean
  createThumbnail?: boolean
  thumbnailMaxHeight?: number
  thumbnailMaxWidth?: number
  thumbnailKeepAspect?: boolean
}

export class ImageUtil {
  static off : HTMLCanvasElement
  static offscreen() : HTMLCanvasElement {
    if (!ImageUtil.off) {
      ImageUtil.off = document.createElement('canvas')
    } 
    return ImageUtil.off
  }
  


  public static THUMBNAIL_WIDTH = 242

  private static DefaultOptions: LoadImageOptions = {
    // keepAspect: true,
    // maxWidth: 0,
    // maxHeight: 0,
    createThumbnail: false,
    thumbnailMaxHeight: 0,
    thumbnailMaxWidth: ImageUtil.THUMBNAIL_WIDTH,
    thumbnailKeepAspect: true
  }

  public static loadImg(file: File, options?: LoadImageOptions): Observable<ImageResult> {
    const opts = Object.assign({}, ImageUtil.DefaultOptions)
    if (options) {
      Object.assign(opts, options)
    }

    const result = new Subject<ImageResult>()
    const imgResult = new ImageResult()
    imgResult.file = file;

    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = function () {
      var url = reader.result
      var img = new Image()
      img.src = url.toString()
      imgResult.dataURL = url.toString()

      img.onload = function () {
        imgResult.width = img.width
        imgResult.height = img.height
        imgResult.aspect = img.width / img.height

        if (opts.createThumbnail) {
          let canvas = document.createElement('canvas')
          // set size proportional to image
          let w = ImageUtil.THUMBNAIL_WIDTH * (img.width / img.height);
          canvas.width = ImageUtil.THUMBNAIL_WIDTH;
          canvas.height = canvas.width * (img.height / img.width);

          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(b => imgResult.thumb = b)
          imgResult.thumbHeight = canvas.height
          imgResult.thumbWidth = canvas.width

          canvas.remove()
        }

        // val.next(result)
        result.next(imgResult)
        result.complete()
      }
    }
    return result
  }

  public static loadImage(canvas: HTMLCanvasElement, url: string) {
    let img = new Image()
    img.src = url
    img.onload = function () {
      console.log("On Load");

      // set size proportional to image
      let w = ImageUtil.THUMBNAIL_WIDTH * (img.width / img.height);
      canvas.width = ImageUtil.THUMBNAIL_WIDTH;
      canvas.height = canvas.width * (img.height / img.width);

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }

  public static processFile(canvas: HTMLCanvasElement, f: File): Observable<ImageResult> {


    console.log("Processing");
    // let thumbImg = this.myimagethumb
    let bigCanvas = document.createElement('canvas')
    if (!canvas) {
      canvas = document.createElement('canvas')
    }
    let result = new ImageResult()
    let subscriber: Subscriber<ImageResult>
    let val = new Observable<ImageResult>(i => {
      subscriber = i
    })
    // let val = new ReplaySubject<ImageResult>()
    let reader = new FileReader()
    reader.readAsDataURL(f)

    reader.onloadend = function () {
      console.log("Load End");

      var url = reader.result
      var img = new Image()
      img.src = url.toString()

      img.onload = function () {
        console.log("On Load");

        bigCanvas.width = img.naturalWidth
        bigCanvas.height = img.naturalHeight
        bigCanvas.getContext('2d').drawImage(img, 0, 0)
        bigCanvas.toBlob(b => result.image = b)

        // set size proportional to image
        let w = 150 * (img.width / img.height);
        canvas.width = 150;
        canvas.height = canvas.width * (img.height / img.width);

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        result.height = img.height
        result.width = img.width
        canvas.toBlob(b => result.thumb = b)

        console.log(result);

        // val.next(result)
        subscriber.next(result)
        subscriber.complete()
      }
    }
    return val
  }

  public static MarkX(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const offscreen = document.createElement('canvas');

      // Load the Image (0.7)
      const image = new Image()
      image.crossOrigin = "Anonymous"
      image.onload = () => {
        offscreen.width = image.width;
        offscreen.height = image.height;
        const ctx = offscreen.getContext('2d');
        ctx['filter'] = 'blur(7px)';

        ctx.drawImage(image, 0, 0);
        ctx.lineWidth = image.width * .1;
        ctx.strokeStyle = 'darkred'
        ctx.lineCap = 'round'

        // ctx.filter = "none";
        ctx.beginPath();

        ctx.moveTo(image.width * .2, image.height * .2);
        ctx.lineTo(image.width - image.width * .2, image.height - image.height * .2);
        ctx.moveTo(image.width * .2, image.height - image.height * .2);
        ctx.lineTo(image.width - image.width * .2, image.height * .2);
        ctx.stroke();

        resolve(offscreen.toDataURL())
      }
      image.src = url
    })

  }
}

