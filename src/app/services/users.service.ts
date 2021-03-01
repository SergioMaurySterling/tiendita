import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { usersM } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { UsersE } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private todosCollection: AngularFirestoreCollection<usersM>;
  private todos: Observable<usersM[]>;

  constructor(private db: AngularFirestore
    ) {
      this.todosCollection = db.collection<usersM>('users');

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
    return this.todosCollection.doc<usersM>(id).valueChanges();
  }

  getTodo2(id: string) {
    return this.todosCollection.doc<UsersE>(id).valueChanges();
  }

  updateTodo(todo: usersM, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: usersM) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getUsersByCat(name: string) {
    return this.db.collection('users', ref => ref.where('category', '==', name)).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersByRol(name: string) {
    return this.db.collection('users', ref => ref
    .where('rol', '==', name)
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersByEmail(name: string) {
    return this.db.collection('users', ref => ref
    .where('email', '==', name)
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersByRolIsActive(name: string, status: boolean) {
    return this.db.collection('users', ref => ref
    .where('rol', '==', name)
    .where('isActive', '==', status)
    .orderBy('name', 'asc')
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersEIsActive(name: string, status: boolean) {
    return this.db.collection('users', ref => ref
    .where('isActive', '==', status)
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as UsersE;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsersByIsActive() {
    return this.db.collection('users', ref => ref
    .where('isActive', '==', true)
    .orderBy('name', 'asc')
    ).snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('users', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as usersM;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
