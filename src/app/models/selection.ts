export class Selection {

    public static readonly MARKER = 'marker'

    constructor(public items: any[], public type?: string) {
        console.log("Created Select of " + this.items.length);
    }

    public get first(): any {
        if (this.items && this.items.length > 0) {
            return this.items[0]
        }
    }

    toggle(...objs): Selection {
        let myItems = this.items.slice(0)
        objs.forEach(item => {
            console.log("Looking at ", item.name);

            if (myItems.includes[item]) {
                let i = myItems.indexOf(item)
                myItems = myItems.splice(i, 1)
            } else {
                myItems.push(item)
            }
        })

        myItems.forEach(i => {
            console.log("In selection ", i.name);
        })

        return new Selection([])
    }

    public isEmpty() {
        return !(this.items && this.items.length > 0)
    }

    public removed(previous: Selection): any[] {
        let found = previous.items.filter(prevItem => !this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
    public added(previous: Selection): any[] {
        let found = this.items.filter(item => !previous.items.includes(item))
        if (found) {
            return found
        }
        return []
    }
    public same(previous: Selection): any[] {
        let found = previous.items.filter(prevItem => this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
}

