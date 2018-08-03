import { Injectable } from '@angular/core';
import { IUndoableAction } from './commands/IUndoableAction';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  stack: IUndoableAction[] = []
  current = -1

  canRedo(): boolean {
    return (this.current >= 0 && this.stack.length < this.current - 1)
  }

  redo() {
    if (this.canRedo()) {
      this.current++
      const action = this.stack[this.current]
      action.redo()
    }
  }

  canUndo(): boolean {
    return (this.current >= 0 && this.stack.length > 0)
  }

  undo() {
    if (this.canUndo()) {
      const action = this.stack[this.current--]
      action.undo()
    }
  }

  record(cmd: IUndoableAction) {
    this.current++
    if (this.stack.length > this.current + 1) {
      this.stack.splice(this.current)
    }
    this.stack.push(cmd)
  }

  constructor() { }
}
