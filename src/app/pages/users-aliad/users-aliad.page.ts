import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-aliad',
  templateUrl: './users-aliad.page.html',
  styleUrls: ['./users-aliad.page.scss'],
})
export class UsersAliadPage implements OnInit {

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
  selectTabs = 'Noactives';

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

        this.userService.getUsersByRolIsActive('emp', true).subscribe(res => {
          loading.dismiss();
          this.todos = res;
        });

        this.userService.getUsersByRolIsActive('emp', false).subscribe(res => {
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
