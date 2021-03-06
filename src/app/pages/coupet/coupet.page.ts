import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { AddmodalPage } from '../addmodal/addmodal.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { TodoService } from 'src/app/services/todo.service';
import { Modals } from 'src/app/models/modal';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-coupet',
  templateUrl: './coupet.page.html',
  styleUrls: ['./coupet.page.scss'],
})
export class CoupetPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private loadingController: LoadingController,
    public af: AngularFireAuth,
    private todoService: TodoService,
    private router: Router,
    private userService: UsersService,
  ) { }

  todos: Modals[];
  textoBuscar = '';
  user;
  uid;
  rol;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.todoService.getTodoByModal('danger').subscribe(res => {
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
          color: 'danger',
          nombre: 'Coupet'
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
          color: 'danger',
          nombre: 'Coupet'
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
