import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductCat } from 'src/app/models/productCat';

@Injectable({
  providedIn: 'root'
})
export class ProductCatService {

  private todosCollection: AngularFirestoreCollection<ProductCat>;
  private todos: Observable<ProductCat[]>;

  constructor(
    private db: AngularFirestore,
    ) {
      this.todosCollection = db.collection<ProductCat>('ProductCat');

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
    return this.todosCollection.doc<ProductCat>(id).valueChanges();
  }

  updateTodo(todo: ProductCat, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: ProductCat) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }

}
