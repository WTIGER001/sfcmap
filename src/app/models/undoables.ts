import { IUndoableAction } from "../commands/IUndoableAction";
import { DataService } from "../data.service";

export class DataUndoable implements IUndoableAction {

  constructor(private data: DataService, private newItem: any, private oldItem) {

  }

  undo() {
    if (this.oldItem) {
      this.data.save(this.oldItem)
    } else {
      this.data.delete(this.newItem)
    }
  }

  redo() {
    this.data.save(this.newItem)
  }
}

export class CompositeUndoable implements IUndoableAction {
  items: IUndoableAction[] = []
  push(...items: IUndoableAction[]) {
    this.items.push(...items)
  }
  undo() {
    this.items.forEach(i => i.undo())
  }
  redo() {
    this.items.forEach(i => i.redo())
  }
}