import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Calendar } from '../models/calendar';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private todosCollection: AngularFirestoreCollection<Calendar>;
  private todos: Observable<Calendar[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
  ) {
    this.todosCollection = db.collection<Calendar>('calendar');

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
    return this.todosCollection.doc<Calendar>(id).valueChanges();
  }

  updateTodo(todo: Calendar, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Calendar) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

  getTodoByCat(name: string) {
    return this.db.collection('calendar', ref => ref
    .where('category', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUid(name: string) {
    return this.db.collection('calendar', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserUidDesc(name: string) {
    return this.db.collection('calendar', ref => ref
    .where('userUid', '==', name)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByModal(name: string) {
    return this.db.collection('calendar', ref => ref
    .where('color', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByCatidEmisorUidCupos(cat, emisorUid) {

    const date = new Date();
    date.setHours(23, 59, 59, 999);

    return this.db.collection('calendar', ref => ref
    .where('catId', '==', cat)
    .where('emisorUid', '==', emisorUid)
    .where('endTime', '>=', date)
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByEmisor(emisorUid) {

    const date = new Date();
    date.setHours(23, 59, 59, 999);

    return this.db.collection('calendar', ref => ref
    .where('catId', '==', emisorUid)
    .where('endTime', '>=', date)
    )
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByRol(name: string) {
    return this.db.collection('calendar', ref => ref
    .where('rol', '==', name)
    .orderBy('date', 'asc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoIsActiveDesc() {
    return this.db.collection('calendar', ref => ref
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoByUserProductIsActive(id) {
    return this.db.collection('calendar', ref => ref
    .where('userUid', '==', id)
    .where('isActive', '==', true)
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTodoOrderByDesc() {
    return this.db.collection('calendar', ref => ref
    .orderBy('date', 'desc'))
    .snapshotChanges().pipe( map( rooms => {
      return rooms.map( a => {
        const data = a.payload.doc.data() as Calendar;
        data.uid = a.payload.doc.id;
        return data;
      });
    }));
  }
}
