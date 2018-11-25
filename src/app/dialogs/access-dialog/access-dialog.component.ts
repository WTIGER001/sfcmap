import { Component, OnInit, Input } from '@angular/core';
import { User, RestrictedContent, IAsset, Restricition, Asset } from '../../models';
import { DataService } from '../../data.service';
import { ReplaySubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DbConfig } from '../../models/database-config';

@Component({
    selector: 'app-access-dialog',
    templateUrl: './access-dialog.component.html',
    styleUrls: ['./access-dialog.component.css']
})
export class AccessDialogComponent implements OnInit {
    item: Asset
    fields: any[] = []
    users: User[] = []
    result = new ReplaySubject<boolean>()

    constructor(private data: DataService, public activeModal: NgbActiveModal) {
        this.data.users.subscribe(u => this.users = u)
    }

    ngOnInit() {
        this.calcFields()
    }

    calcFields() {
        const availableFields = DbConfig.restrictableFields(this.item)
        availableFields.forEach(field => {
            const v: any = {
                name: field,
                value: Restricition.PlayerReadWrite
            }

            if (this.item.restrictedContent && this.item.restrictedContent[field]) {
                v.value = this.item.restrictedContent[field]
            }

            this.fields.push(v)
        })

    }

    getIcon(field, value): string {
        if (field.value == value) {
            return 'check'
        }
        if (field.value < value) {
            return ''
        }
        return ''
    }

    getIconClass(field, value): string {
        if (field.value == value) {
            return 'checked-font'
        }
        if (field.value < value) {
            return 'checked-font'
        }
        return 'unchecked-font'
    }

    setField(field, value) {
        console.log("Setting ", field, value);

        field.value = value
    }

    setFields(value) {
        this.fields.forEach(field => {
            field.value = value
        })
    }

    ok() {
        const r = {}
        this.fields.forEach(field => {
            r[field.name] = field.value
        })
        this.item.restrictedContent = r

        this.result.next(true)
        this.activeModal.close()
    }

    cancel() {
        this.result.next(false)
        this.activeModal.close()
    }
}
