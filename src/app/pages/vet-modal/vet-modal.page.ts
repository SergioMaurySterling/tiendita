import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { VetCareService } from '../../services/vetcare.service';
import { VetDetailPage } from '../vet-detail/vet-detail.page';
import { ModalAgendarPage } from '../modal-agendar/modal-agendar.page';
import { PayService } from '../../services/pay.service';
import { firestore, auth } from 'firebase';
import { Pay } from '../../models/pay';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';
import { AngularFirestore } from '@angular/fire/firestore';
import { VetCare } from '../../models/vetCare';

declare var WidgetCheckout: any;

@Component({
  selector: 'app-vet-modal',
  templateUrl: './vet-modal.page.html',
  styleUrls: ['./vet-modal.page.scss'],
})
export class VetModalPage implements OnInit {

  @Input() color;
  @Input() nombre;
  @Input() id;
  user2;

  constructor(
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private modalCtrl3: ModalController,
    private modalCtrl4: ModalController,
    private todoService: VetCareService,
    private loadingController: LoadingController,
    public afs: AngularFireAuth,
    private userService: UsersService,
    public router: Router,
    public afAuth: AngularFireAuth,
    private alertController: AlertController,
    private alertController2: AlertController,
    private alertController3: AlertController,
    private af: AngularFirestore,
  ) { }

  todos;
  user;
  ald;
  rating;
  empName = [];
  empRate = [];
  isActive = [];
  empDirection = [];
  empImageUrl = [];

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    // NO ELIMINAR
    this.userService.getTodos().subscribe(res => {
      this.user = res;
      loading.dismiss();
    });

    this.userService.getTodo((await this.afs.currentUser).uid).subscribe(res => {
      this.user = res;
      loading.dismiss();
    });

    this.todoService.getTodoIsActiveDescCatId(this.id).subscribe(async res => {
      loading.dismiss();
      this.todos = res;

      for (let index = 0; index < this.todos.length; index++) {
        const element = this.todos[index];
        this.userService.getTodo2(element.asociadoID).subscribe(res => {
          this.empName.push(res.name);
          this.empRate.push(res.rate);
          this.isActive.push(res.isActive);
          this.empDirection.push(res.direction);
          this.empImageUrl.push(res.imageUrl);
        });
      }

    });
  }

  Agendar(Aid, Aname, VetId){

    this.modalCtrl3.create({
      component: ModalAgendarPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        id: Aid,
        color: 'secondary',
        nombre: Aname,
        catId: this.id,
        vetId: VetId
      }
    }).then( (modalCtrl3) => modalCtrl3.present());

    // this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  abrirModal(Mid, asociado){
    this.modalCtrl2.create({
      component: VetDetailPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        id: Mid,
        color: 'secondary',
        nombre: asociado
      }
    }).then( (modalCtrl2) => modalCtrl2.present());
  }

  async checkout(price, eUid, vName, uid){
    const direction = this.user.direction;

    const vetData = await this.alertController3.create({
      header: 'Observaciones',
      mode: 'md',
      inputs:[
        {
          name: 'observation',
          type: 'textarea',
          placeholder: 'Ingrese observaciones para el servicio',
        }
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },{
          text: 'Pagar',
          handler: async (dato) => {
            if (dato && dato.observation !== '') {
              const pData = dato.observation
              const alert = await this.alertController.create({
                header: 'Seleccionar pago',
                subHeader: 'El mes empezara correr al momento de usted realizar la solicitud',
                mode: 'md',
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
                        if (price === 0) {
                          const alert2 = await this.alertController2.create({
                            header: 'Alert',
                            message: 'Debe agregar productos al carrito.',
                            buttons: ['OK']
                          });
                          await alert2.present();
                        } else {
                          this.afAuth.authState.subscribe( userL => {
                            if (userL) {
                              const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                              const checkout = new WidgetCheckout({
                                currency: 'COP',
                                amountInCents: price * 100,
                                reference: random,
                                publicKey: environment.wompi.publicKey,
                                redirectUrl: 'https://transaction-redirect.wompi.co/check' // Opcional
                              });
          
                              // tslint:disable-next-line: only-arrow-functions
                              checkout.open( function( result ) {
                                const transaction = result.transaction;
                                console.log('Transaction ID: ', transaction.id);
                                console.log('Transaction object: ', transaction);
                                VetModalPage.saveTodo(
                                  uid,
                                  eUid,
                                  vName,
                                  transaction.id,
                                  transaction.reference,
                                  transaction.paymentMethod,
                                  transaction.paymentMethodType,
                                  transaction.customerData,
                                  transaction.status,
                                  transaction.amountInCents,
                                  direction,
                                  pData
                                );
                              });
                            } else {
                              console.log('not loging');
                              this.closeModal();
                              this.router.navigate(['/login']);
                            }
                          });
                        }
                        // this.closeModal();
                      } else if (data === '2'){
                        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        VetModalPage.saveTodo(uid, eUid, vName, null, random, 'CASH', 'CASH', null, 'APPROVED', price * 100, direction, pData);
          
                        // this.closeModal();
          
                        const alert2 = await this.alertController2.create({
                          header: 'Alert',
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
        }
      ]
    });
    await vetData.present();

    
  }

  // tslint:disable-next-line: member-ordering
  static saveTodo(vUid, eUid, vName, id, reference, pMethodType, pMethod, cData, st, amount, dir, petData) {

    const uid = auth().currentUser.uid;

    const saveTodo: Pay = {
      uid: vUid,
      WompiPayId: id,
      ReferenceId: reference,
      userUid: uid,
      empUid: eUid,
      paymentMethod: pMethod,
      paymentMethodType: pMethodType,
      customerData: cData,
      status: st,
      total: amount / 100,
      products: vName,
      direction: dir,
      rating: false,
      petData: petData,
      date: new Date().toString()
    };

    const firebase = firestore().collection('PayVet');
    firebase.add(saveTodo);

    this.getVetData(vUid).then(data => {
      VetCareService.Todos(vUid).update({
        amountVent: +data + 1
      });
    })
  }

  static getVetData(uid){
    return new Promise((resolve) => {
      VetCareService.getTodo(uid).subscribe(res => {
        resolve(res.amountVent);
      });
    });
  }

  getTotal() {
    return this.todos.price;
  }

}
