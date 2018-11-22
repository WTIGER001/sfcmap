import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuraVisible } from 'src/app/models/aura';

@Component({
  selector: 'app-visibility-toggle',
  templateUrl: './visibility-toggle.component.html',
  styleUrls: ['./visibility-toggle.component.css']
})
export class VisibilityToggleComponent implements OnInit {

  @Input() visible: AuraVisible = AuraVisible.NotVisible
  @Output() changes = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  toggle(event) {
    const reverse = event.ctrlKey

    if (this.visible == AuraVisible.NotVisible) {
      this.visible = reverse ? AuraVisible.OnHover : AuraVisible.Visible
    } else if (this.visible == AuraVisible.Visible) {
      this.visible = reverse ? AuraVisible.NotVisible : AuraVisible.OnSelect
    } else if (this.visible == AuraVisible.OnSelect) {
      this.visible = reverse ? AuraVisible.Visible : AuraVisible.OnHover
    } else if (this.visible == AuraVisible.OnHover) {
      this.visible = reverse ? AuraVisible.OnSelect : AuraVisible.NotVisible
    } else {
      this.visible = AuraVisible.NotVisible
    }
    this.changes.emit(this.visible)
  }

}
