import { Component, OnInit } from '@angular/core';
import { Modals } from '../../models/modal';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { VetCareService } from '../../services/vetcare.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-mypublications',
  templateUrl: './mypublications.page.html',
  styleUrls: ['./mypublications.page.scss'],
})
export class MypublicationsPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private vetCareService: VetCareService,
    private productsService: ProductService,
    private userService: UsersService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public af: AngularFireAuth,
  ) { }

  todos: Modals[];
  todos2: Modals[];

  textoBuscar = '';

  user;
  rol;

  selectTabs = 'vetCare';

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

    this.productsService.getTodoByUserUidDesc((await this.af.currentUser).uid).subscribe(res => {
      loading.dismiss();
      this.todos = res;
    });

    this.vetCareService.getTodoByUserUidDesc((await this.af.currentUser).uid).subscribe(res => {
      loading.dismiss();
      this.todos2 = res;
    });

  }

  async onRemove(item){
    this.vetCareService.removeTodo(item.id);
    const alert = await this.alertController.create({
      message: 'Datos eliminados.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onRemovePetshop(item){
    this.productsService.removeTodo(item.uid);
    const alert = await this.alertController.create({
      message: 'Datos eliminados.',
      buttons: ['OK']
    });
    await alert.present();
    // window.location.reload();
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  change(event, id){
    this.vetCareService.Todos(id).update({
      isActive: event
    });
  }

  change2(event, id){
    this.productsService.Todos(id).update({
      isActive: event
    });
  }

}
