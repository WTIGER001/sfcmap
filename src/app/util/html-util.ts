import { DomUtil } from "leaflet";

export class HtmlUtil {

  public static wrap(el : HTMLElement, wrapper: HTMLElement) {
    // insert wrapper before el in the DOM tree
    el.parentNode.insertBefore(wrapper, el);

    // move el into wrapper
    wrapper.appendChild(el);
  }

 
  
}