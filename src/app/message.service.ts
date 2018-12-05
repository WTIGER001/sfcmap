/**
 * The message service is used to send messages between players
 */
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { ChatMessage, ChatRecord, DiceRoll, Game, PingMessage, User, UserChatLastCleared, UserChatLastSeen } from './models';
import { DbConfig } from './models/database-config';
import { LangUtil } from './util/LangUtil';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private user: User
  public rollRequests = new Subject<string>()
  public messages = new ReplaySubject<ChatRecord>()

  constructor(private data: DataService) {
    this.data.user.subscribe(u => this.user = u)
   
    this.getMyChatMessages2().pipe(
      tap( message => this.messages.next(message)),
      // tap(m => console.log("Message Recorded", m))
    ).subscribe()
  }

  requestRoll(expression: string) {
    this.rollRequests.next(expression)
  }

  getMyChatMessages2(): Observable<ChatRecord> {
    return this.data.game.pipe(
      filter(game => (game != undefined && game.id != undefined)),
      mergeMap(game => this.data.db.list<ChatRecord>(DbConfig.pathFolderTo(ChatRecord.TYPE, game.id), ref => ref.orderByChild('time').limitToLast(100)).stateChanges(['child_added'])),
      tap(action => this.data.record('chat-message', 1)),
      filter(action => action.type == 'child_added'),
      map(action => ChatRecord.to(action.payload.val())),
      distinctUntilKeyChanged('id'),
    )
  }

  getLastSeen(): Observable<UserChatLastSeen> {
    const path = DbConfig.ASSET_FOLDER + "/" + this.data.game.value.id + "/user-chat-last-seen/" + this.data.user.value.id
    return this.data.db.object<UserChatLastSeen>(path).valueChanges()
  }

  getLastCleared(game?: Game): Observable<UserChatLastCleared> {
    if (!game) {
      game = this.data.game.value
    }
    const path = DbConfig.ASSET_FOLDER + "/" + game.id + "/user-chat-last-cleared/" + this.data.user.value.id
    return this.data.db.object<UserChatLastCleared>(path).valueChanges().pipe(tap( obj => obj.game = game.id))
  }

  setLastSeen(lastMessage: number) {
    const seen = new UserChatLastSeen()
    seen.lastSeen = lastMessage
    const path = DbConfig.ASSET_FOLDER + "/" + this.data.game.value.id + "/user-chat-last-seen/" + this.data.user.value.id
    this.data.db.object<UserChatLastSeen>(path).set(seen)
  }

  clearGameMessages() {
    // console.log("Clearing Messages");
    const clear = new UserChatLastCleared()
    clear.lastCleared = Date.now()
    const path = DbConfig.ASSET_FOLDER + "/" + this.data.game.value.id + "/user-chat-last-cleared/" + this.data.user.value.id
    this.data.db.object<UserChatLastCleared>(path).set(clear)
  }

  deleteGameMessages() {
    // console.log("Deleteing Messages");
    if (this.data.isGM()) {
      const chatPath = DbConfig.pathFolderTo(ChatRecord.TYPE, this.data.game.value.id)
      this.data.db.list<ChatRecord>(chatPath).remove()
    }
  }

  sendMessage(msg: ChatMessage | DiceRoll | PingMessage) {
    // console.log("Sending Message : ", msg);

    let c = new ChatRecord()
    c.time = Date.now()
    c.id = UUID.UUID().toString()
    c.uid = this.user.id
    c.owner = this.data.game.value.id
    c.record = LangUtil.prepareForStorage(msg)

    if (DiceRoll.is(c.record)) {
      let d = c.record
      for (let i = 0; i < d.dice.length; i++) {
        d.dice[i] = LangUtil.prepareForStorage(d.dice[i])
      }
    }
    this.data.save(c)
  }

  onPing$(): Observable<ChatRecord> {
    return this.messages.pipe(
      filter(item => {
        if (PingMessage.is(item.record)) {
          return (new Date().getTime()) - item.time < 3000
        }
        return false
      })
    )

  }

}
