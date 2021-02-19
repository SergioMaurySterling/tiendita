import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { Chat } from '../models/chats';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private todosCollection: AngularFirestoreCollection<Chat>;
  private todosCollectiondesc: AngularFirestoreCollection<Chat>;
  private todos: Observable<Chat[]>;
  private todosdesc: Observable<Chat[]>;

  constructor(
    private db: AngularFirestore
    ) {
    this.todosCollection = db.collection<Chat>('chatRooms');

    this.todos = this.todosCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));

    this.todosCollectiondesc = db.collection<Chat>('chatRooms', ref => ref.orderBy('chatRoomDate', 'desc'));

    this.todosdesc = this.todosCollectiondesc.snapshotChanges().pipe(map(
      actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
  }

  getTodosDesc(){
    return this.todosdesc;
  }

  getTodos() {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todosCollection.doc<Chat>(id).valueChanges();
  }

  updateTodo(todo: Chat, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Chat) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  // tslint:disable-next-line: variable-name
  getChatRoom( chat_id: string ) {
    return this.db.collection('chatRooms').doc(chat_id).valueChanges();
  }

  // tslint:disable-next-line: variable-name
  sendMsgToFirebase( message, chat_id: string ) {
    this.db.collection('chatRooms').doc(chat_id).update({
      messages: firestore.FieldValue.arrayUnion(message),
    });
  }

  getUsersByEmisorDesc(name: string) {
    return this.db.collection('chatRooms', ref => ref
    .where('emisorUid', '==', name)
    .orderBy('chatRoomDate', 'desc')
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Chat;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getChatByUserEmpColor(emisor: string, receptor: string, color: string) {
    return this.db.collection<Chat>('chatRooms', ref => ref
    .where('emisorUid', '==', emisor)
    .where('receptorUid', '==', receptor)
    .where('chatColor', '==', color)
    .orderBy('chatRoomDate', 'desc')
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Chat;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersByReceptorDesc(name: string) {
    return this.db.collection('chatRooms', ref => ref
    .where('receptorUid', '==', name)
    .orderBy('chatRoomDate', 'desc')
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Chat;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

}
