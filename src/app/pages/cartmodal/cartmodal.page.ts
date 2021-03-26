import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Product } from 'src/app/services/cart.service';
import { CartService } from '../../services/cart.service';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { PayService } from '../../services/pay.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firestore, auth } from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartPage } from '../cart/cart.page';
import { Pay } from '../../models/pay';
import { UsersService } from '../../services/users.service';
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/app/services/product.service';
import firebase from 'firebase';

declare var WidgetCheckout: any;
declare var ePayco: any;
declare var google;

@Component({
  selector: 'app-cartmodal',
  templateUrl: './cartmodal.page.html',
  styleUrls: ['./cartmodal.page.scss'],
})
export class CartmodalPage implements OnInit {

  @Input() empId;

  dirAct;

  autocomplete;
  autocompleteItems: any[];
  GoogleAutocomplete: any;

  latitude = 0;
  longitude = 0;
  geo;

  service = new google.maps.places.AutocompleteService();

  directionForm: FormGroup;

  cart: Product[] = [];
  // tslint:disable-next-line: member-ordering
  static cart: Product[] = [];

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private payService: PayService,
    public userService: UsersService,
    public afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private router: Router,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private alertController: AlertController,
    private alertController2: AlertController,
  ) {
    this.validatorsForms();

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  time;
  uid;
  user;
  direction;
  Userlat;
  Userlng;
  userFullName;

  emp;
  empUid;
  Emplat;
  Emplng;
  empDelivery;
  // tslint:disable-next-line: member-ordering
  static cartService: CartService;

  hide = false;

  async validatorsForms() {
    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        autocomplete: [''],
        direction: [''],
      });
    } else{
      this.directionForm = this.formBuilder.group({
        autocomplete: ['', Validators.required],
        direction: ['', Validators.required],
      });
    }
  }

  async ngOnInit() {

    console.log(CartPage.eId);
    this.cart = CartService.getCart();

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.afAuth.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        loading.dismiss();
        this.userService.getTodo(this.uid).subscribe(res => {
          loading.dismiss();
          this.user = res;

          this.userFullName = this.user.name + ' ' + this.user.lastname;
          this.direction = this.user.direction;
          this.Userlat = this.user.latitude;
          this.Userlng = this.user.longitude;
          console.log('logeado');
          console.log('Tu ubicación: ' + this.Userlat + ' ' + this.Userlng);
        });

        this.userService.getTodo(this.empId).subscribe(res => {
          loading.dismiss();
          this.emp = res;

          this.empUid = this.emp.uid;
          this.Emplat = this.emp.latitude;
          this.Emplng = this.emp.longitude;
          this.empDelivery = Math.ceil(this.emp.delivery * this.haversine_distance()/1000)*1000;
          if(this.empDelivery > 0 && this.empDelivery < 5000){
            this.empDelivery = 5000;
          } else{
            this.empDelivery;
          }
          console.log('logeado');
          console.log('Ubicación Aliado : ' + this.Emplat + ' ' + this.Emplng);
        });

      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });
    
    this.hora();
  }

  hora(){
    const ahora = new Date();
    const hora = ahora.getHours() + 3;
    const min = ahora.getMinutes();
    if (hora >= 9 && hora < 19) {
      this.time = 'Hora aproximada de entrega: ' + hora + ':' + min;
    } else if (hora >= 19 && hora < 24){
      this.time = 'El pedido será entregado a partir de mañana a las 9am';
    } else {
      this.time = 'El pedido será entregado a partir de hoy a las 9am';
    }
}

  decreaseCartItem(product) {
    CartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    CartService.addProduct(product);
  }

  removeCartItem(product){
    CartService.removeProduct(product);
  }

  getTotal() {
    if (this.empDelivery !== null ){
      return this.cart.reduce(( i, j ) => i + j.price * j.amount, 0) + this.empDelivery;
    } else {
      return this.cart.reduce(( i, j ) => i + j.price * j.amount, 0);
    }
  }

  haversine_distance() {
    const empDist = {empLat: this.Emplat, empLng: this.Emplng};
    const userDist = {userLat: this.Userlat, userLng: this.Userlng};

    var R = 6371.0710; // Radio de la Tierra en kilometros
    var rlat1 = empDist.empLat * (Math.PI/180); // Convertir grados a radianes
    var rlat2 = userDist.userLat * (Math.PI/180); // Convertir grados a radianes
    var difflat = rlat2-rlat1; // Diferencia en radianes (latitudes)
    var difflon = (userDist.userLng-empDist.empLng) * (Math.PI/180); // Diferencia en radianes (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async checkout(){
    if (this.getTotal() === 0) {
      const alert2 = await this.alertController2.create({
        message: 'Debe agregar productos al carrito.',
        buttons: ['OK']
      });
      await alert2.present();
      this.close();
    } else {
    const alert = await this.alertController.create({
      header: 'Seleccionar pago',
      mode: 'ios',
      inputs: [
        {
          name: 'name1',
          type: 'radio',
          value: '1',
          label: 'Online',
        },
        {
          name: 'name2',
          type: 'radio',
          value: '2',
          label: 'Efectivo',
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
          handler: async (data) => {
            if (data === '1'){

                // tslint:disable-next-line: max-line-length
                const deliveryPlaces = {direction: this.direction, userlat: this.Userlat, userlng: this.Userlng, emplat: this.Emplat, emplng: this.Emplng};

                const delivPrice = this.empDelivery;

                this.afAuth.authState.subscribe( userL => {
                  if (userL) {
                    // const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    // const handler = ePayco.checkout.configure({
                    //   key: environment.ePayco.publicKey,
                    //   test: true
                    // });
                    // const data={
                    //   name: "Pago web petti",
                    //   description: "Pago web petti",
                    //   invoice: random,
                    //   currency: "cop",
                    //   amount: this.getTotal().toString(),
                    //   tax_base: "0",
                    //   tax: "0",
                    //   country: "co",
                    //   lang: "es",

                    //   external: "false",

                    //   confirmation: "http://secure2.payco.co/prueba_curl.php",
                    //   response: "http://secure2.payco.co/prueba_curl.php",

                    //   name_billing: this.userFullName,
                    //   address_billing: this.direction,
                    //   type_doc_billing: "cc",

                    // methodsDisable: ["SP","CASH"]

                    //   }
                    
                    // handler.open(data)
                    // console.log(data)

                    // const firebase = firestore().collection('Pay');
                    // firebase.add(data);

                    const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    const checkout = new WidgetCheckout({
                      currency: 'COP',
                      amountInCents: this.getTotal() * 100,
                      reference: random,
                      publicKey: environment.wompi.publicKey,
                      redirectUrl: 'https://transaction-redirect.wompi.co/check' // Opcional
                    });

                    // tslint:disable-next-line: only-arrow-functions
                    checkout.open( function( result ) {
                      const transaction = result.transaction;
                      console.log('Transaction ID: ', transaction.id);
                      console.log('Transaction object: ', transaction);
                      CartmodalPage.saveTodo(
                        transaction.id,
                        transaction.reference,
                        transaction.paymentMethod,
                        transaction.paymentMethodType,
                        transaction.customerData,
                        transaction.status,
                        transaction.amountInCents,
                        deliveryPlaces,
                        delivPrice
                      );
                    });
                    this.router.navigate(['/historial']);
                  } else {
                    console.log('not loging');
                    this.close();
                    this.router.navigate(['/login']);
                  }
                });
                this.close();
            }else if (data === '2'){
              const total = this.getTotal();

              // tslint:disable-next-line: max-line-length
              const deliveryPlaces = {direction: this.direction, userlat: this.Userlat, userlng: this.Userlng, emplat: this.Emplat, emplng: this.Emplng};

              const delivPrice = this.empDelivery;

              const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              CartmodalPage.saveTodo2(null, random, 'CASH', 'CASH', null, 'APPROVED', total, deliveryPlaces, delivPrice);

              this.close();

              const alert2 = await this.alertController2.create({
                message: 'Pago registrado con exito.',
                buttons: ['OK']
              });
              await alert2.present();

              this.router.navigate(['/historial']);
            }
          }
        }
      ]
    });
    await alert.present();
    }
  }

  // tslint:disable-next-line: member-ordering
  static saveTodo(id, reference, pMethodType, pMethod, cData, st, amount, dPlaces, delivPrice) {

    const uid = auth().currentUser.uid;
    const cart = CartService.getCart();

    const saveTodo: Pay = {
      WompiPayId: id,
      ReferenceId: reference,
      userUid: uid,
      empUid: CartPage.eId,
      paymentMethod: pMethod,
      paymentMethodType: pMethodType,
      customerData: cData,
      status: st,
      dPrice: delivPrice,
      total: amount / 100,
      products: cart,
      deliveryDirections: dPlaces,
      rating: false,
      date: new Date().toString()
    };

    CartService.delCart();
    CartService.delItemCount();

    const firebase = firestore().collection('Pay');
    firebase.add(saveTodo);

    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];

      this.getProductData(element.uid).then(data => {
        ProductService.Todos(element.uid).update({
          amountVent: data + element.amount
        });
      })

    }
  }

  // tslint:disable-next-line: member-ordering
  static saveTodo2(id, reference, pMethodType, pMethod, cData, st, amount, dPlaces, delivPrice) {

    const uid = auth().currentUser.uid;
    const cart = CartService.getCart();

    const saveTodo: Pay = {
      WompiPayId: id,
      ReferenceId: reference,
      userUid: uid,
      empUid: CartPage.eId,
      paymentMethod: pMethod,
      paymentMethodType: pMethodType,
      customerData: cData,
      status: st,
      dPrice: delivPrice,
      total: amount,
      products: cart,
      deliveryDirections: dPlaces,
      rating: false,
      date: new Date().toString()
    };

    CartService.delCart();
    CartService.delItemCount();

    const firebase = firestore().collection('Pay');
    firebase.add(saveTodo);
    
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];

      this.getProductData(element.uid).then(data => {
        ProductService.Todos(element.uid).update({
          amountVent: data + element.amount
        });
      })

    }
  }

  static getProductData(uid){
    return new Promise((resolve) => {
      ProductService.getTodo(uid).subscribe(res => {
        resolve(res.amountVent);
      });
    });
  }

  chooseItem(item: any) {
    this.geo = item;
    this.geoCode(this.geo); // convert Address to lat and long
    this.autocomplete.query = item;
    this.ClearAutocomplete();
  }

  updateSearch() {
    if (this.autocomplete.query === '') {
     this.autocompleteItems = [];
     return;
    }
    const me = this;
    this.service.getPlacePredictions({
    input: this.autocomplete.query,
    componentRestrictions: {
      country: 'co'
    }
   }, (predictions, status) => {
     me.autocompleteItems = [];

     me.zone.run(() => {
     if (predictions != null) {
        predictions.forEach((prediction: { description: any; }) => {
          me.autocompleteItems.push(prediction.description);
        });
       }
     });
   });
  }

  // convert Address string to lat and long
  geoCode(address: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
    this.latitude = results[0].geometry.location.lat();
    this.longitude = results[0].geometry.location.lng();
    // console.log('lat: ' + this.latitude + ', long: ' + this.longitude);
    console.log(this.latitude);
    console.log(this.longitude);
   });
 }

  ClearAutocomplete(){
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  async changeDir(){

    if (this.autocomplete === undefined || this.autocomplete === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la direccion en places',
        buttons: ['OK']
      });
      await alert.present();
      
    } else if (this.direction === undefined || this.direction === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la direccion en places',
        buttons: ['OK']
      });
      await alert.present();
      
    } else {
      if (this.dirAct === this.direction) {
        this.direction = this.autocomplete.query
      }
      this.Emplat = this.latitude;
      this.Emplng = this.longitude;
      this.empDelivery = Math.ceil(this.emp.delivery * this.haversine_distance()/1000)*1000;
      if(this.empDelivery > 0 && this.empDelivery < 5000){
        this.empDelivery = 5000;
      } else{
        this.empDelivery;
      }
      console.log('Ubicación Aliado : ' + this.Emplat + ' ' + this.Emplng + ' ' + this.direction);
      this.hide = false;
    }
    
  }

  dir(){
    this.hide = true;
    this.dirAct = this.direction;
  }
  cancelDir(){
    this.hide = false;
  }

}
