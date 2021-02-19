import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.page.html',
  styleUrls: ['./modal-product.page.scss'],
})
export class ModalProductPage implements OnInit {

  @Input() color;
  @Input() nombre;
  @Input() id;

  constructor(
    private modalCtrl: ModalController,
    private todoService: ProductService,
    private loadingController: LoadingController,
    public afs: AngularFireAuth,
    private modalCtrl2: ModalController,
    private imagesService: ImagesService,
    private alertController: AlertController,
  ) { }

  todos;
  todosImg;
  user;

  productName;
  price;
  userName;
  date;
  description;
  delprice;

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.imagesService.getTodoByProduct(this.id).subscribe(async res => {
      this.todosImg = res;
      console.log(this.todosImg);
      loading.dismiss();
    });

    this.todoService.getTodo(this.id).subscribe(async res => {
      loading.dismiss();
      this.todos = res;

      this.productName = res.name;
      this.price = res.price;
      this.delprice = res.delprice;
      this.userName = res.userName;
      this.date = res.date;
      this.description = res.description;
    });

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async addToCart(product) {
    const alert2 = await this.alertController.create({
      header: 'Alert',
      message: 'Producto agregado al carrito.',
      buttons: ['OK']
    });
    await alert2.present();
    CartService.addProduct(product);
  }

}
