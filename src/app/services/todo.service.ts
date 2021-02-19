import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Modals } from '../models/modal';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todosCollection: AngularFirestoreCollection<Modals>;
  private todos: Observable<Modals[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    ) {
      this.todosCollection = db.collection<Modals>('modals');

      this.todos = this.todosCollection.snapshotChanges().pipe(map(
        actions => {
          return actions.map( a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        }
      ));
  }

  Todos(id: string){
    return this.todosCollection.doc(id);
  }

  getTodos() {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todosCollection.doc<Modals>(id).valueChanges();
  }

  updateTodo(todo: Modals, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Modals) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getTodoByCat(name: string) {
    return this.db.collection('modals', ref => ref
    .where('category', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUid(name: string) {
    return this.db.collection('modals', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('modals', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('modals', ref => ref
    .where('color', '==', name)
    .where('isActive', '==', true)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('modals', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('modals', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Modals;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
