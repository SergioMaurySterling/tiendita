import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(
    public af: AngularFireAuth,
    private userService: UsersService,
    private loadingController: LoadingController,

  ) { }

  textoBuscar = '';
  user;
  todos;
  todos2;
  uid;
  rol;
  selectTabs = 'actives';

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.af.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        this.userService.getTodo(this.uid).subscribe(res => {
          loading.dismiss();
          this.user = res;

          this.rol = this.user.rol;
          console.log('logeado');
        });

        this.userService.getUsersByRolIsActive('user', true).subscribe(res => {
          loading.dismiss();
          this.todos = res;
        });

        this.userService.getUsersByRolIsActive('user', false).subscribe(res => {
          loading.dismiss();
          this.todos2 = res;
        });
      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  change(event, id){
    this.userService.Todos(id).update({
      isActive: event
    });
  }

}
