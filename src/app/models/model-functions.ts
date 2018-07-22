import { Annotation, ShapeAnnotation, MarkerTypeAnnotation, ImageAnnotation } from "./annotations";
import { IObjectType } from "./core";

/* ----------------------------------------------------------------------- */
/* IS FUNCTIONS                                                            */
/* ----------------------------------------------------------------------- */
export function isAnnotation(obj: any): obj is Annotation {
    return isObjectType(obj, Annotation.TYPE)
}

export function isImageAnnotation(obj: any): obj is ImageAnnotation {
    return isObjectSubtype(obj, ImageAnnotation.TYPE, ImageAnnotation.SUBTYPE)
}

function isObjectType(obj: any, objType: string): boolean {
    return obj.objType !== undefined && obj.objType === objType
}

function isObjectSubtype(obj: any, objType: string, subType: string): boolean {
    return obj.objType !== undefined && obj.objType === objType && obj.subType !== undefined && obj.subType === subType
}


/* ----------------------------------------------------------------------- */
/* TO FUNCTIONS                                                            */
/* ----------------------------------------------------------------------- */
export function to(obj: any): IObjectType {
    if (isAnnotation(obj)) { return ToMarkerTypeAnnotation(obj) }
}

export function ToMarkerTypeAnnotation(obj: any): MarkerTypeAnnotation {
    return Object.assign(new MarkerTypeAnnotation(), obj)
}

export function ToImageAnnotation(obj: any): ImageAnnotation {
    return Object.assign(new ImageAnnotation(), obj)
}




/* ----------------------------------------------------------------------- */
/* PATH FUNCTIONS                                                          */
/* ----------------------------------------------------------------------- */
