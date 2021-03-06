import { Component, OnInit } from '@angular/core';
import { Modals } from '../../models/modal';
import { TodoService } from '../../services/todo.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-mymodals',
  templateUrl: './mymodals.page.html',
  styleUrls: ['./mymodals.page.scss'],
})
export class MymodalsPage implements OnInit {

  constructor(
    private todoService: TodoService,
    private userService: UsersService,
    private loadingController: LoadingController,
    public af: AngularFireAuth,
  ) { }

  todos: Modals[];
  todos2: Modals[];

  textoBuscar = '';

  user;
  rol;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      loading.dismiss();
      this.user = res;
      this.rol = this.user.rol;
    });

    this.todoService.getTodoOrderByDesc().subscribe(res => {
      loading.dismiss();
      this.todos = res;
    });

    this.todoService.getTodoByUserUidDesc((await this.af.currentUser).uid).subscribe(res => {
      loading.dismiss();
      this.todos2 = res;
    });

  }

  onRemove(item){
    this.todoService.removeTodo(item.id);
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  change(event, id){
    this.todoService.Todos(id).update({
      isActive: event
    });
  }

}
