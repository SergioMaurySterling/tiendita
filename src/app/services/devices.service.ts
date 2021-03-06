import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { Devices } from '../models/devices';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private todosCollection: AngularFirestoreCollection<Devices>;
  private todos: Observable<Devices[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    ) {
      this.todosCollection = db.collection<Devices>('devices');

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
    return this.todosCollection.doc<Devices>(id).valueChanges();
  }

  updateTodo(todo: Devices, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Devices) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getDevicesByUid(name: string) {
    return this.db.collection('devices', ref => ref
    .where('userId', '==', name))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUid(name: string) {
    return this.db.collection('devices', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByEmpUid(name: string) {
    return this.db.collection('devices', ref => ref
    .where('empUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByEmpStatus(id: string, name: string) {
    return this.db.collection('devices', ref => ref
    .where('empUid', '==', id)
    .where('status', '==', name)
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('devices', ref => ref
    .where('asociadoID', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('devices', ref => ref
    .where('color', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('devices', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDesc() {
    return this.db.collection('devices', ref => ref
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDescCatId(id) {
    return this.db.collection('devices', ref => ref
    .where('isActive', '==', true)
    .where('catId', '==', id)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('devices', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Devices;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
