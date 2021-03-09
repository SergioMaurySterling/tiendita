import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ModalController, ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartmodalPage } from '../cartmodal/cartmodal.page';
import { usersM } from 'src/app/models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AddProductPage } from '../add-product/add-product.page';
import { UsersService } from 'src/app/services/users.service';
import { ProductCatService } from '../../services/product-cat.service';
import { ModalProductPage } from '../modal-product/modal-product.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(
    private platform: Platform,
    private cartService: CartService,
    private productsService: ProductService,
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    public afAuth: AngularFireAuth,
    public actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private userService: UsersService,
    private route: ActivatedRoute,
    private productCatService: ProductCatService,
    private router: Router,
  ) {}
  static eId;

  public user$: Observable<usersM> = this.afAuth.user;

  cart = [];
  products;
  cartItemCount: BehaviorSubject<number>;
  imageUrl;
  rol;
  user;
  aliado;
  uid;
  aldName;
  aldHorario;

  productCat;

  textoBuscar = '';
  textoBuscarB = '';
  todoId = null;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.afAuth.authState.subscribe( userL => {
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
    

    this.todoId = this.route.snapshot.params.id;
    CartPage.eId = this.route.snapshot.params.id;

    if (this.todoId) {
      this.productsService.getTodoByUserProductIsActive(this.todoId).subscribe(res => {
        loading.dismiss();
        this.products = res;
      });

      this.userService.getTodo(this.todoId).subscribe(res => {
        loading.dismiss();
        this.aliado = res;

        this.aldName = this.aliado.name;
        this.aldHorario = this.aliado.horario;
      });

      this.productCatService.getTodos().subscribe(res => {
        this.productCat = res;
        loading.dismiss();
      });
    }

    this.cart = CartService.getCart();
    this.cartItemCount = CartService.getCartItemCount();
  }

  addToCart(product) {
    CartService.addProduct(product);
  }

  async openCart(){
    this.modalCtrl.create({
      component: CartmodalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        empId: this.todoId,
      }
    }).then( (modalCtrl) => modalCtrl.present());
  }

  abrirNewModal(){
    this.modalCtrl2.create({
      component: AddProductPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        color: 'tertiary',
        nombre: 'Agregar Producto'
      }
    }).then( (modalCtrl2) => modalCtrl2.present());
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  async SelectCat(id){
    console.log(id);
    this.textoBuscarB = id;
  }

  async abrirModal(Mid){
    if ((await this.afAuth.currentUser)){
      this.modalCtrl.create({
        component: ModalProductPage,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          product: Mid,
          color: 'dark',
          nombre: 'Producto'
        }
      }).then( (modalCtrl) => modalCtrl.present());
    } else {
      this.router.navigate(['/login']);
    }
  }

}
