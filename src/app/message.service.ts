/**
 * The message service is used to send messages between players
 */
import { Injectable } from '@angular/core';
import { ChatMessage, DiceRoll, ChatRecord, PingMessage, User, UserChatLastCleared, UserChatLastSeen, Game } from './models';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { filter, map, mergeMap, take, tap, distinctUntilChanged, distinctUntilKeyChanged } from 'rxjs/operators';
import { DataService } from './data.service';
import { LangUtil } from './util/LangUtil';
import { UUID } from 'angular2-uuid';
import { DbConfig } from './models/database-config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private user: User
  public rollRequests = new Subject<string>()

  constructor(private data: DataService) {
    this.data.user.subscribe(u => this.user = u)
  }

  requestRoll(expression: string) {
    this.rollRequests.next(expression)
  }

  getMyChatMessages(game: Game): Observable<ChatRecord> {
    const chatPath = DbConfig.pathFolderTo(ChatRecord.TYPE, game.id)
    return this.getLastCleared(game).pipe(
      take(1),
      mergeMap(last => this.data.db.list<ChatRecord>(chatPath, ref => ref.orderByChild('time').limitToLast(100).startAt(last ? last.lastCleared : 0)).stateChanges()),
      filter(action => action.type == 'child_added'),
      map(action => ChatRecord.to(action.payload.val())),
      distinctUntilKeyChanged('id'),
    )
  }

  getMyChatMessages2(): Observable<ChatRecord> {
   return  this.data.game.pipe(
      filter(game =>  (game != undefined && game.id != undefined) ),
      mergeMap(game => this.getLastCleared(game)),
      mergeMap(last => this.data.db.list<ChatRecord>(DbConfig.pathFolderTo(ChatRecord.TYPE, last.game), ref => ref.orderByChild('time').limitToLast(100).startAt(last ? last.lastCleared : 0)).stateChanges()),
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
    console.log("Clearing Messages");
    const clear = new UserChatLastCleared()
    clear.lastCleared = Date.now()
    const path = DbConfig.ASSET_FOLDER + "/" + this.data.game.value.id + "/user-chat-last-cleared/" + this.data.user.value.id
    this.data.db.object<UserChatLastCleared>(path).set(clear)
  }

  deleteGameMessages() {
    console.log("Deleteing Messages");
    if (this.data.isGM()) {
      const chatPath = DbConfig.pathFolderTo(ChatRecord.TYPE, this.data.game.value.id)
      this.data.db.list<ChatRecord>(chatPath).remove()
    }
  }

  sendMessage(msg: ChatMessage | DiceRoll | PingMessage) {
    console.log("Sending Message : ", msg);

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
    return this.data.db.list<ChatRecord>("chat").stateChanges().pipe(
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
