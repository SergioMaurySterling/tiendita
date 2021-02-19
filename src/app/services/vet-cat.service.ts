import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VetCat } from '../models/vetCat';

@Injectable({
  providedIn: 'root'
})
export class VetCatService {

  private todosCollection: AngularFirestoreCollection<VetCat>;
  private todos: Observable<VetCat[]>;

  constructor(
    private db: AngularFirestore,
    ) {
      this.todosCollection = db.collection<VetCat>('vetCat');

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
    return this.todosCollection.doc<VetCat>(id).valueChanges();
  }

  updateTodo(todo: VetCat, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: VetCat) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

}
