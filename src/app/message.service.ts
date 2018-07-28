/**
 * The message service is used to send messages between players
 */
import { Injectable } from '@angular/core';
import { ChatMessage, DiceRoll, ChatRecord, PingMessage, User } from './models';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { filter, map } from 'rxjs/operators';
import { DataService } from './data.service';
import { LangUtil } from './util/LangUtil';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private user: User
  constructor(private firedb: AngularFireDatabase, private data: DataService) {
    this.data.user.subscribe(u => this.user = u)
  }

  sendMessage(msg: ChatMessage | DiceRoll | PingMessage) {
    let c = new ChatRecord()
    c.time = Date.now()
    c.uid = this.user.uid
    c.record = LangUtil.prepareForStorage(msg)

    if (DiceRoll.is(c.record)) {
      let d = c.record
      for (let i = 0; i < d.dice.length; i++) {
        d.dice[i] = LangUtil.prepareForStorage(d.dice[i])
      }
    }
    this.firedb.list("chat").push(c)
  }

  onPing$(): Observable<ChatRecord> {
    return this.firedb.list<ChatRecord>("chat").stateChanges().pipe(
      filter(value => {
        let item = value.payload.val()

        if (PingMessage.is(item.record)) {
          return (new Date().getTime()) - item.time < 3000
        }
        return false
      }),
      map(action => ChatRecord.to(action.payload.val()))
    )

  }

}
