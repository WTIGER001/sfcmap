/**
 * The command service provides a common area for running commands. Commands can have key bindings and state (active, inactive, etc)
 */
import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { DataService } from './data.service';
import { NotifyService } from './notify.service';
import { CommonDialogService } from './dialogs/common-dialog.service';
import { MessageService } from './message.service';
import { AudioService } from './audio.service';
import { Map as LeafletMap, DomUtil, DomEvent, LatLng, LeafletMouseEvent } from 'leaflet';
import { IUndoableAction } from './commands/IUndoableAction';
import { CopyCommand } from './commands/copy';
import { PasteCommand } from './commands/paste';
import { DeleteCommand } from './commands/delete';
import { ICommand } from './commands/ICommand';
import { UndoRedoService } from './undo-redo.service';
import { UndoCommand } from './commands/undo';
import { RedoCommand } from './commands/redo';
import { CutCommand } from './commands/cut';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  private commands: ICommand[] = []
  private keyBindings = new Map<string, ICommand>()
  private map: LeafletMap
  private lastMouse: LatLng

  constructor(private mapSvc: MapService, private data: DataService, private notify: NotifyService, private dialog: CommonDialogService,
    private msg: MessageService, private audio: AudioService, private undo: UndoRedoService) {

    this.mapSvc.map.subscribe(map => {

      this.removeHooks()
      this.map = map
      this.addHooks()
    })

    this.register(new CopyCommand(mapSvc))
    this.register(new CutCommand(mapSvc, data))
    this.register(new PasteCommand(mapSvc, data))
    this.register(new DeleteCommand(mapSvc, data, dialog))
    this.register(new UndoCommand(undo))
    this.register(new RedoCommand(undo))

    console.log(this.keyBindings);
  }

  register(cmd: ICommand) {
    this.commands.push(cmd)
    if (cmd.keyBinding && cmd.keyBinding.length > 0) {
      this.keyBindings.set(cmd.keyBinding.toLowerCase(), cmd)
    }
  }

  private addHooks() {
    const mapContainer = this.map.getContainer()
    DomEvent.on(mapContainer, ' keyup', this.process, this)
    this.map.on('mousemove', this.saveMouse, this)
    // this.map.on('keydown keyup', this.process, this)
    this.commands.find(c => c.name == 'paste').enable()
  }

  private saveMouse(e: LeafletMouseEvent) {
    this.lastMouse = e.latlng
  }

  private removeHooks() {
    if (this.map) {
      const mapContainer = this.map.getContainer()
      DomEvent.off(mapContainer, ' keyup', this.process, this)
      this.map.off('mousemove', this.saveMouse, this)
      this.commands.find(c => c.name == 'paste').disable()
    }
  }

  private process(event: any) {
    const stmt = this.buildKeyStatement(event)
    console.log("Keyboard Statement ", stmt);
    if (this.keyBindings.has(stmt)) {
      const factory = this.keyBindings.get(stmt)
      console.log("Running Command ", factory.name);
      try {
        factory.execute(event, this.lastMouse)
      } catch (err) {
        console.error(err);
      }
    }
  }

  private buildKeyStatement(event: KeyboardEvent) {
    let stmt = []
    if (event.ctrlKey || event.metaKey) {
      stmt.push('ctrl')
    }
    if (event.shiftKey) {
      stmt.push('shift')
    }
    if (event.altKey) {
      stmt.push('ALT')
    }
    stmt.push(event.key)

    let combined = stmt.join("+").toLowerCase()

    return combined
  }

}
