interface Callback<A, B> {
    (key: A, value: B, map: BidirectionalMap<A, B>): void
}

const remove = <A, B>(item: A, from: A[], pair: B[]) => {
    let index = from.indexOf(item)

    if (index !== -1) {
        from.splice(index, 1)
        pair.splice(index, 1)

        return true
    }

    return false
}

const get = <A, B>(key: A, keys: A[], values: B[]) => {
    const index = keys.indexOf(key)

    if (index !== -1) {
        return values[index]
    }
}

const has = <A>(item: A, array: A[]) => {
    return array.indexOf(item) !== -1
}

const iterator = <A>(array: A[]) => {
    return array.values()
}

export default class BidirectionalMap<A, B> {
    private mapkeys: Array<A> = new Array()
    private mapvalues: Array<B> = new Array()

    set(key: A, value: B) {
        remove(key, this.mapkeys, this.mapvalues)
        remove(value, this.mapvalues, this.mapkeys)

        this.mapkeys.push(key)
        this.mapvalues.push(value)
    }

    get size() {
        return this.mapkeys.length
    }

    hasKey(key: A) {
        return has(key, this.mapkeys)
    }

    hasValue(value: B) {
        return has(value, this.mapvalues)
    }

    deleteKey(key: A) {
        return remove(key, this.mapkeys, this.mapvalues)
    }

    deleteValue(value: B) {
        return remove(value, this.mapvalues, this.mapkeys)
    }

    getKey(value: B) {
        return get(value, this.mapvalues, this.mapkeys)
    }

    getValue(key: A) {
        return get(key, this.mapkeys, this.mapvalues)
    }

    clear() {
        while (this.mapkeys.length > 0) {
            this.mapkeys.shift()
            this.mapvalues.shift()
        }
    }

    keys() {
        return iterator(this.mapkeys)
    }

    values() {
        return iterator(this.mapvalues)
    }

    forEach(callback: Callback<A, B>, thisArg?: any) {
        let index = 0
        while (index < this.size) {
            if (index in this.mapkeys) {
                const key = this.mapkeys[index]
                const value = this.mapvalues[index]

                callback.call(thisArg, key, value, this)
            }

            index++
        }
    }
}