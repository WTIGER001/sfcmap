import "reflect-metadata";

/**
 * Collection of language utils that are useful for all Typescript applications
 */
export class LangUtil {
    public static dimensions(arr: any[]): number {
        let dims = this.getDim(arr);
        return dims.length
    }

    public static getDim(a) {
        var dim = [];
        for (; ;) {
            dim.push(a.length);

            if (Array.isArray(a[0])) {
                a = a[0];
            } else {
                break;
            }
        }
        return dim;
    }

    public static getDecoratedFields(decoratorName: string, object: any): string[] {
        return Object.keys(object).filter(key => LangUtil.hasFieldDecorator(decoratorName, object, key))
    }

    public static hasFieldDecorator(decoratorName: string, object: any, propertyKey: string) {
        const key = Symbol(decoratorName)
        return Reflect.hasMetadata(key, object, propertyKey)
    }

    public static prepareForStorage(obj: any, sample?: any): any {
        const copy = LangUtil.shallowCopy(obj, sample)
        // LangUtil.removeTransients(copy)
        LangUtil.removeTransients(copy)
        LangUtil.clean(copy)

        return copy
    }

    public static shallowCopy(src: any, sample?: any): any {
        let dest = {}
        for (var propName in sample || src) {
            if (typeof src[propName] === 'function') {

            } else {
                dest[propName] = src[propName]
            }
        }
        return dest
    }

    public static removeTransients(obj: any) {
        for (var propName in obj) {
            if (propName.startsWith("_")) {
                delete obj[propName];
            }
        }
    }

    public static clean(obj): any {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    }

    public static trimExtraneousFields(obj: any, sample: any) {
        if (sample) {
            let fields = new Map<string, boolean>()
            for (var propName in sample) {
                fields.set(propName, true)
            }
            for (var propName in obj) {
                if (!fields.has(propName)) {
                    delete obj[propName];
                }
            }
        }
    }

    public static baseColor(hexColor: string): string {
        return hexColor.substr(0, 7)
    }

    public static colorAlpha(hex: string): number {
        if (hex.length == 9) {
            let alphaHex = hex.substr(7, 2)
            let base255 = parseInt(alphaHex, 16)
            let alpha = base255 / 255
            return alpha
        }
        return 1
    }
}