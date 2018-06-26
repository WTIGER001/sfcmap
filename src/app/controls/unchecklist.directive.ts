import { Directive, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Directive({
  host: {
    '(change)': 'triggerOnChange($event)',
    '[checked]': 'isChecked',
  },
  selector: '[unchecklist]',
})
export class UnchecklistDirective implements OnChanges {
  @Input() unchecklist: any[];
  @Input() unchecklistValue: any;
  @Input() maxSelectedItems = -1;
  @Output() unchecklistChange = new EventEmitter<any[]>();
  isChecked: boolean;

  ////////////
  ngOnChanges() {
    const checklist = this.unchecklist || [];
    this.isChecked = !checklist.includes(this.unchecklistValue)
  }

  triggerOnChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    let updatedList;
    const checklist = this.unchecklist || [];

    if (target && target.checked) {
      if (this.maxSelectedItems === -1 || checklist.length < this.maxSelectedItems) {
        // updatedList = [...checklist, this.checklistValue];
        const i = checklist.indexOf(this.unchecklistValue);
        updatedList = [...checklist.slice(0, i), ...checklist.slice(i + 1)];

        this.unchecklistChange.emit(updatedList);
      } else {
        target.checked = false;
      }
    } else {
      // const i = checklist.indexOf(this.checklistValue);
      // updatedList = [...checklist.slice(0, i), ...checklist.slice(i + 1)];
      updatedList = [...checklist, this.unchecklistValue];
      this.unchecklistChange.emit(updatedList);
    }
  }
}