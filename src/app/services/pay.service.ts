import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { Pay } from '../models/pay';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  private todosCollection: AngularFirestoreCollection<Pay>;
  private todos: Observable<Pay[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    ) {
      this.todosCollection = db.collection<Pay>('Pay');

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
    return this.todosCollection.doc<Pay>(id).valueChanges();
  }

  updateTodo(todo: Pay, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Pay) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getTodoByCat(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('catId', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUid(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByEmpUid(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('empUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByEmpStatus(id: string, name: string) {
    return this.db.collection('Pay', ref => ref
    .where('empUid', '==', id)
    .where('status', '==', name)
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('asociadoID', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('color', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('Pay', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDesc() {
    return this.db.collection('Pay', ref => ref
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDescCatId(id) {
    return this.db.collection('Pay', ref => ref
    .where('isActive', '==', true)
    .where('catId', '==', id)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('Pay', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Pay;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
