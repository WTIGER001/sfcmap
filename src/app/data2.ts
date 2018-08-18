import { AngularFirestore } from "angularfire2/firestore";
import { Game, User } from "./models";

export class Data2 {

  constructor(private db: AngularFirestore, private user: User) {

  }

  public getGames() {
    // return this.db.collection<Game>('games', ref => ref.where('players', 'array-contains', this.user.uid)
  }





}