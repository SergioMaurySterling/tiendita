import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VetCare } from '../models/vetCare';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VetCareService {

  private todosCollection: AngularFirestoreCollection<VetCare>;
  static todosCollection: AngularFirestoreCollection<VetCare>;
  
  private todos: Observable<VetCare[]>;
  static todos: Observable<VetCare[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    ) {
      this.todosCollection = db.collection<VetCare>('vetCare');
      VetCareService.todosCollection = db.collection<VetCare>('vetCare');

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

  static Todos(id: string){
    return this.todosCollection.doc(id);
  }

  getTodos() {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todosCollection.doc<VetCare>(id).valueChanges();
  }

  static getTodo(id: string) {
    return this.todosCollection.doc<VetCare>(id).valueChanges();
  }

  updateTodo(todo: VetCare, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: VetCare) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getTodoByCat(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('catId', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUid(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidOrderAmountVent(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('asociadoID', '==', name)
    .orderBy('amountVent', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('asociadoID', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('color', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('vetCare', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDesc() {
    return this.db.collection('vetCare', ref => ref
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDescCatId(id) {
    return this.db.collection('vetCare', ref => ref
    .where('isActive', '==', true)
    .where('catId', '==', id)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('vetCare', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as VetCare;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
