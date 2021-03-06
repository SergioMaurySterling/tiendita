import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { PayService } from '../../services/pay.service';
import { PayVetService } from '../../services/pay-vet.service';
import { UserModalPage } from '../user-modal/user-modal.page';
import { RatePage } from '../rate/rate.page';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  todos;
  todos2;
  textoBuscar = '';
  uid;
  rol;
  user;
  uName;
  changeStatusOrder;
  search;

  selectTabs = 'petShop';

  directionForm: FormGroup;

  constructor(
    private loadingController: LoadingController,
    public af: AngularFireAuth,
    private payService: PayService,
    private payVetService: PayVetService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private alertController2: AlertController,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      search: [''],
    });
  }

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
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

          if (this.rol === 'admin'){
            this.payService.getTodos().subscribe(res2 => {
              loading.dismiss();
              this.todos = res2;
              console.log(this.todos);
            });

            this.payVetService.getTodos().subscribe(res2 => {
              loading.dismiss();
              this.todos2 = res2;
              console.log(this.todos);
            });
          }

          if (this.rol === 'emp'){
            this.payService.getTodoByEmpUid(this.uid).subscribe(res2 => {
              loading.dismiss();
              this.todos = res2;
              console.log(this.todos);
            });

            this.payVetService.getTodoByEmpUid(this.uid).subscribe(res2 => {
              loading.dismiss();
              this.todos2 = res2;
              console.log(this.todos);
            });
          } else if (this.rol === 'user'){
            this.payService.getTodoByUserUid(this.uid).subscribe(res2 => {
              loading.dismiss();
              this.todos = res2;
              console.log(this.todos);
            });

            this.payVetService.getTodoByUserUid(this.uid).subscribe(res2 => {
              loading.dismiss();
              this.todos2 = res2;
              console.log(this.todos);
            });
          }
        });
      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });
  }

  openData(id){
    console.log(id);
    this.modalCtrl.create({
      component: UserModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        userId: id
      }
    }).then( (modalCtrl) => modalCtrl.present());
  }

  async buscar(event){
    if (this.search){
      this.textoBuscar = event.detail.value;
    } else {
      const alert2 = await this.alertController2.create({
        message: 'Selecciona el filtro de busqueda.',
        buttons: ['OK']
      });
      await alert2.present();
    }
  }

  async changeStatus(id){
    console.log(id);
    if (this.changeStatusOrder === 'REJECTED'){

      const alert = await this.alertController.create({
        header: 'Cancelar',
        mode: 'ios',
        inputs: [
          {
            name: 'name1',
            type: 'textarea',
            placeholder: '¿Porque cancelara la orden?',
          },
        ],
        buttons: [
          {
            text: 'CANCELAR',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log('Confirm Ok', data);
              console.log(this.changeStatusOrder);
              console.log(id);
              if (data && data.name1 !== '') {
                this.payService.Todos(id).update({
                  status: this.changeStatusOrder,
                  reasonCancel: data.name1
                });
              }
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.payService.Todos(id).update({
        status: this.changeStatusOrder
      });
    }
  }

  async changeStatus2(id){
    console.log(id);
    if (this.changeStatusOrder === 'REJECTED'){

      const alert = await this.alertController.create({
        header: 'Cancelar',
        mode: 'ios',
        inputs: [
          {
            name: 'name1',
            type: 'textarea',
            placeholder: '¿Porque cancelara la orden?',
          },
        ],
        buttons: [
          {
            text: 'CANCELAR',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log('Confirm Ok', data);
              console.log(this.changeStatusOrder);
              console.log(id);
              if (data && data.name1 !== '') {
                this.payVetService.Todos(id).update({
                  status: this.changeStatusOrder,
                  reasonCancel: data.name1
                });
              }
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.payVetService.Todos(id).update({
        status: this.changeStatusOrder
      });
    }
  }

  ratePage(emUid, Uid, data){
    this.modalCtrl.create({
      component: RatePage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        empId: emUid,
        hUid: Uid,
        type: data
      }
    }).then( (modalCtrl) => modalCtrl.present());
  }

}
