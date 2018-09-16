import { Directive, ElementRef, AfterContentInit, Input, AfterViewInit } from '@angular/core';

/**
 * textFit(document.getElementById('target-div'), options);
 */
@Directive({
  selector: '[appTextfit]'
})
export class TextfitDirective implements AfterViewInit {
  private element: HTMLElement;

  @Input() alignVert= false // if true, textFit will align vertically using css tables
  @Input() alignHoriz= false // if true, textFit will set text-align= center
  @Input() multiLine= false // if true, textFit will not set white-space= no-wrap
  @Input() detectMultiLine= true// disable to turn off automatic multi-line sensing
  @Input() minFontSize= 6
  @Input() maxFontSize= 35
  @Input() reProcess= true // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
  @Input() widthOnly= true // if true, textFit will fit text to element width, regardless of text height
  @Input() alignVertWithFlexbox= false // if true, textFit will use flexbox for vertical alignment

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  ngAfterViewInit() {
    const options = {
      alignVert: this.alignVert, 
      alignHoriz: this.alignHoriz, 
      multiLine: this.multiLine,
      detectMultiLine: this.detectMultiLine,
      minFontSize: this.minFontSize,
      maxFontSize: this.maxFontSize,
      reProcess: this.reProcess, 
      widthOnly: this.widthOnly, 
      alignVertWithFlexbox: this.alignVertWithFlexbox
    }
    console.log("OPTIONS", options);

    this.textFit(this.element, options)
  }


  textFit(els, options) {
    console.log("OPTIONS", options);

    if (!options) options = {};

    // Extend options.
    var settings = options;
    console.log("settings", settings);

    // Convert jQuery objects into arrays
    if (typeof els.toArray === "function") {
      els = els.toArray();
    }

    // Support passing a single el
    var elType = Object.prototype.toString.call(els);
    if (elType !== '[object Array]' && elType !== '[object NodeList]' &&
      elType !== '[object HTMLCollection]') {
      els = [els];
    }

    console.log("SETTINGS", settings);

    // Process each el we've passed.
    for (var i = 0; i < els.length; i++) {
      this.processItem(els[i], settings);
    }
  };

  /**
   * The meat. Given an el, make the text inside it fit its parent.
   * @param  {DOMElement} el       Child el.
   * @param  {Object} settings     Options for fit.
   */
  processItem(el, settings) {
    if (!this.isElement(el) || (!settings.reProcess && el.getAttribute('textFitted'))) {
      return false;
    }

    console.log("step 1")

    // Set textFitted attribute so we know this was processed.
    if (!settings.reProcess) {
      el.setAttribute('textFitted', 1);
    }

    var innerSpan, originalHeight, originalHTML, originalWidth;
    var low, mid, high;

    // Get element data.
    originalHTML = el.innerHTML;
    originalWidth = this.innerWidth(el);
    originalHeight = this.innerHeight(el);

    console.log("step 2", originalWidth, originalHeight)

    // Don't process if we can't find box dimensions
    if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
      if (!settings.widthOnly)
        throw new Error('Set a static height and width on the target element ' + el.outerHTML +
          ' before using textFit!');
      else
        throw new Error('Set a static width on the target element ' + el.outerHTML +
          ' before using textFit!');
    }

    console.log("step 3")

    // Add textFitted span inside this container.
    if (originalHTML.indexOf('textFitted') === -1) {
      innerSpan = document.createElement('span');
      innerSpan.className = 'textFitted';
      // Inline block ensure it takes on the size of its contents, even if they are enclosed
      // in other tags like <p>
      innerSpan.style['display'] = 'inline-block';
      innerSpan.innerHTML = originalHTML;
      el.innerHTML = '';
      el.appendChild(innerSpan);
    } else {
      // Reprocessing.
      innerSpan = el.querySelector('span.textFitted');
      // Remove vertical align if we're reprocessing.
      if (this.hasClass(innerSpan, 'textFitAlignVert')) {
        innerSpan.className = innerSpan.className.replace('textFitAlignVert', '');
        innerSpan.style['height'] = '';
        el.className.replace('textFitAlignVertFlex', '');
      }
    }

    console.log("step 4")

    // Prepare & set alignment
    if (settings.alignHoriz) {
      el.style['text-align'] = 'center';
      innerSpan.style['text-align'] = 'center';
    }

    // Check if this string is multiple lines
    // Not guaranteed to always work if you use wonky line-heights
    var multiLine = settings.multiLine;
    if (settings.detectMultiLine && !multiLine &&
      innerSpan.scrollHeight >= parseInt(window.getComputedStyle(innerSpan)['font-size'], 10) * 2) {
      multiLine = true;
    }

    // If we're not treating this as a multiline string, don't let it wrap.
    if (!multiLine) {
      el.style['white-space'] = 'nowrap';
    }

    low = settings.minFontSize + 1;
    high = settings.maxFontSize + 1;
    console.log("step 5", low, high, settings.minFontSize, settings.maxFontSize)

    // Binary search for best fit
    while (low <= high) {
      mid = parseInt(((low + high) / 2)+"", 10);
      innerSpan.style.fontSize = mid + 'px';
      if (innerSpan.scrollWidth <= originalWidth && (settings.widthOnly || innerSpan.scrollHeight <= originalHeight)) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      console.log("step 5a", low, high)
    }
    // Sub 1 at the very end, this is closer to what we wanted.
    innerSpan.style.fontSize = (mid - 1) + 'px';

    console.log("step 6", innerSpan.style.fontSize)


    // Our height is finalized. If we are aligning vertically, set that up.
    if (settings.alignVert) {
      this.addStyleSheet();
      var height = innerSpan.scrollHeight;
      if (window.getComputedStyle(el)['position'] === "static") {
        el.style['position'] = 'relative';
      }
      if (!this.hasClass(innerSpan, "textFitAlignVert")) {
        innerSpan.className = innerSpan.className + " textFitAlignVert";
      }
      innerSpan.style['height'] = height + "px";
      if (settings.alignVertWithFlexbox && !this.hasClass(el, "textFitAlignVertFlex")) {
        el.className = el.className + " textFitAlignVertFlex";
      }
    }

    console.log("step 7")

  }

  // Calculate height without padding.
  innerHeight(el) {
    var style = window.getComputedStyle(el, null);
    return el.clientHeight -
      parseInt(style.getPropertyValue('padding-top'), 10) -
      parseInt(style.getPropertyValue('padding-bottom'), 10);
  }

  // Calculate width without padding.
  innerWidth(el) {
    var style = window.getComputedStyle(el, null);
    return el.clientWidth -
      parseInt(style.getPropertyValue('padding-left'), 10) -
      parseInt(style.getPropertyValue('padding-right'), 10);
  }

  //Returns true if it is a DOM element
  isElement(o) {
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
  }

  hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  // Better than a stylesheet dependency
  addStyleSheet() {
    if (document.getElementById("textFitStyleSheet")) return;
    var style = [
      ".textFitAlignVert{",
      "position: absolute;",
      "top: 0; right: 0; bottom: 0; left: 0;",
      "margin: auto;",
      "display: flex;",
      "justify-content: center;",
      "flex-direction: column;",
      "}",
      ".textFitAlignVertFlex{",
      "display: flex;",
      "}",
      ".textFitAlignVertFlex .textFitAlignVert{",
      "position: static;",
      "}",].join("");

    var css = document.createElement("style");
    css.type = "text/css";
    css.id = "textFitStyleSheet";
    css.innerHTML = style;
    document.body.appendChild(css);
  }
}


