
interface ITab {
    name: string
    icon: string
    help: string
    component: string
    order: number
}

export class Tabs {
    static tabs: ITab[] = []

    static register(name: string,
        icon: string,
        help: string,
        component: string,
        order: number) {
        this.tabs.push({
            name,
            icon,
            help,
            component,
            order
        })

        this.tabs.sort((a, b) => b.order - a.order)
    }


}