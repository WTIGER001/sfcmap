import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { ContextMenuItemComponent } from '../context-menu-item/context-menu-item.component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  items: ContextMenuItemComponent[]
  menu: any
  constructor(private ref: ElementRef) { }

  ngOnInit() {
    // Create the Menu Object
    this.menu = (<any>window).Cmenu(this.ref.nativeElement)
    let menuItems = this.makeItems(this.items)

    // Add the items
    this.menu.config({
      items: menuItems
    })
  }

  private makeItems(items: ContextMenuItemComponent[]): any[] {
    let created = new Array(items.length)

    items.forEach(item => {
      created.push(this.makeItem(item))
    });

    return created
  }

  private makeItem(item: ContextMenuItemComponent): any {
    let i: any = {}
    let children = []
    i.text = item.text

    if (item.clicked) {
      i.click = item.clicked
    }

    if (item.icon) {
      i.icon = item.icon
    }

    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        children.push(this.makeItem(child))
      })

      if (children && children.length > 0) {
        i.children = children
      }
    }

    return i
  }

  show($event: MouseEvent | { pageX: number, pageY: number }): boolean {
    this.menu.show([$event.pageX, $event.pageY])
    return false
  }

  hide() {
    this.menu.hide()
  }

}
