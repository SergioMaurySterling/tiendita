import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { MyData } from '../models/images';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private todosCollection: AngularFirestoreCollection<MyData>;
  private todos: Observable<MyData[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
  ) {
    this.todosCollection = db.collection<MyData>('Images');

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
    return this.todosCollection.doc<MyData>(id).valueChanges();
  }

  updateTodo(todo: MyData, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: MyData) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getTodoByUserInUse(userUid: string) {
    return this.db.collection<MyData>('Images', ref => ref
    .where('userUid', '==', userUid)
    .where('inUse', '==', true)
    .orderBy('date', 'desc')
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getTodoByProduct(product: string) {
    return this.db.collection<MyData>('Images', ref => ref
    .where('productUid', '==', product)
    .orderBy('date', 'asc')
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('Images', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('Images', ref => ref
    .where('color', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('Images', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDesc() {
    return this.db.collection('Images', ref => ref
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserMyDataIsActive(id) {
    return this.db.collection('Images', ref => ref
    .where('userUid', '==', id)
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('Images', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as MyData;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
