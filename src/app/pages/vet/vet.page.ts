import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Modals } from 'src/app/models/modal';
import { VetCatService } from '../../services/vet-cat.service';
import { UsersService } from 'src/app/services/users.service';
import { Observable } from 'rxjs';
import { usersM } from '../../models/user';
import { VetModalPage } from '../vet-modal/vet-modal.page';
import { AddVetPage } from '../add-vet/add-vet.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vet',
  templateUrl: './vet.page.html',
  styleUrls: ['./vet.page.scss'],
})
export class VetPage implements OnInit {

  public user$: Observable<usersM> = this.af.user;

  constructor(
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private loadingController: LoadingController,
    public af: AngularFireAuth,
    private vetCategoryService: VetCatService,
    private userService: UsersService,
    private router: Router,
  ) { }

  todos;
  user;
  rol;
  uid;

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

    this.vetCategoryService.getTodos().subscribe(res => {
      loading.dismiss();
      this.todos = res;
    });

  }

  async abrirModal(Mid, catName){
    if ((await this.af.currentUser)){
      this.modalCtrl.create({
        component: VetModalPage,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          id: Mid,
          color: 'secondary',
          nombre: catName
        }
      }).then( (modalCtrl) => modalCtrl.present());
    } else {
      this.router.navigate(['/login']);
    }
  }

  newVet(){
    this.modalCtrl2.create({
      component: AddVetPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        color: 'secondary',
        nombre: 'Vet & Care'
      }
    }).then( (modalCtrl2) => modalCtrl2.present());
  }

}
