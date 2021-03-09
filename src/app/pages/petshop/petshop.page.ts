import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { UsersService } from 'src/app/services/users.service';
import { RatePage } from '../rate/rate.page';

@Component({
  selector: 'app-petshop',
  templateUrl: './petshop.page.html',
  styleUrls: ['./petshop.page.scss'],
})
export class PetshopPage implements OnInit {

  constructor(
    private platform: Platform,
    public af: AngularFireAuth,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private userService: UsersService,
  ) { }

  uid;
  user;
  aliados;
  rol;
  textoBuscar = '';

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
        });

      } else {
        loading.dismiss();
        console.log('not loging');
      }
      
    });

    this.userService.getUsersByRolIsActive('emp', true).subscribe(res => {
      loading.dismiss();
      this.aliados = res;
    });
    
  }

  average(item){
    let sum = 0;
    for (let index = 0; index < item.length; index++) {
      sum += parseInt(item[index], 10);
    }

    let avg = sum/item.length;

    return avg; 
  }

  delCart(){
    CartService.delCart();
    CartService.delItemCount();
    console.log(CartService.cart);
    console.log(CartService.cartItemCount);
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  async ratePage(uid){
    this.modalCtrl.create({
      component: RatePage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        empId: uid,
      }
    }).then( (modalCtrl) => modalCtrl.present());
  }

}
