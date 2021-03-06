import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Modals } from '../../models/modal';
import { TodoService } from '../../services/todo.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AddmodalPage } from '../addmodal/addmodal.page';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-perdidos',
  templateUrl: './perdidos.page.html',
  styleUrls: ['./perdidos.page.scss'],
})
export class PerdidosPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private todoService: TodoService,
    private loadingController: LoadingController,
    public af: AngularFireAuth,
    private router: Router,
    private userService: UsersService,
  ) { }

  textoBuscar = '';
  todos: Modals[];
  user;
  uid;
  rol;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.todoService.getTodoByModal('primary').subscribe(res => {
      loading.dismiss();
      this.todos = res;
    });

    this.af.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        this.userService.getTodo(this.uid).subscribe(res => {
          loading.dismiss();
          this.user = res;

          this.rol = this.user.rol;
          console.log('logeado');
        });
      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });

  }

  async abrirModal(Mid){
    if ((await this.af.currentUser)){
      this.modalCtrl.create({
        component: ModalPage,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          id: Mid,
          color: 'primary',
          nombre: 'Perdidos'
        }
      }).then( (modalCtrl) => modalCtrl.present());
    } else {
      this.router.navigate(['/login']);
    }
  }

  async abrirNewModal(){
    if ((await this.af.currentUser)){
      this.modalCtrl2.create({
        component: AddmodalPage,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          color: 'primary',
          nombre: 'Perdidos'
        }
      }).then( (modalCtrl2) => modalCtrl2.present());
    } else {
      this.router.navigate(['/login']);
    }
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

}
