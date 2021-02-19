import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';
import { VetCareService } from 'src/app/services/vetcare.service';
import { ChatsPage } from '../chats/chats.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CalendarPage } from '../calendar/calendar.page';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { ModalAgendarPage } from '../modal-agendar/modal-agendar.page';
import { auth, firestore } from 'firebase';
import { Pay } from 'src/app/models/pay';
import { environment } from 'src/environments/environment';

declare var WidgetCheckout: any;

@Component({
  selector: 'app-vet-detail',
  templateUrl: './vet-detail.page.html',
  styleUrls: ['./vet-detail.page.scss'],
})
export class VetDetailPage implements OnInit {

  @Input() color;
  @Input() id;
  @Input() nombre;
  imgUrl: string;

  constructor(
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private modalCtrl3: ModalController,
    private chatsService: ChatsService,
    private todoService: VetCareService,
    private alertController: AlertController,
    private alertController2: AlertController,
    private alertController3: AlertController,
    private loadingController: LoadingController,
    public afs: AngularFireAuth,
    private userService: UsersService,
    public router: Router,
    private modal2: ModalController,
  ) { }

  todos;
  user;
  thisUserUid;
  userUid;

  Description;
  catName;
  price;
  phone;
  uid;

  typeservice;
  date;

  receptorName;
  receptorUid;

  emisorName;
  emisorUid;
  chatRoomDate;

  chat;
  oneChat;

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.afs.currentUser).uid).subscribe(res => {
      this.user = res;

      this.emisorName = this.user.name + ' ' + this.user.lastname;
      this.emisorUid = this.user.uid;
      this.thisUserUid = this.user.uid;
      loading.dismiss();
    });

    this.todoService.getTodo(this.id).subscribe(async res => {
      loading.dismiss();
      this.todos = res;

      this.uid = res.uid;
      this.receptorName = res.asociadoName;
      this.receptorUid = res.asociadoID;
      this.userUid = res.asociadoID;
      this.imgUrl = res.imageUrl;
      this.catName = res.catName;
      this.Description = res.asociadoDescription;
      this.typeservice = res.typeservice;
      this.phone = res.asociadoPhone;
      this.price = res.price;

      this.chatsService.getChatByUserEmpColor((await this.afs.currentUser).uid, this.receptorUid, this.color).subscribe(res2 => {
        this.chat = res2;

        this.oneChat = this.chat.shift();
        loading.dismiss();
      });
    });
  }

  AddChatRoom(){
    if (this.oneChat){
      this.openChat(this.oneChat);
    } else{
      const eventCopy = {
        receptorName: this.receptorName,
        receptorUid: this.receptorUid,
        emisorName: this.emisorName,
        emisorUid: this.emisorUid,
        chatColor: this.color,
        chatRoomDate: new Date().toString()
      };

      this.chatsService.addTodo(eventCopy).then( async res => {

        const chat = res;
        this.openChat(chat);
        this.closeModal();
        this.chatRooms();

        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Se ha creado la nueva sala de chat con ' + this.receptorName,
          buttons: ['OK']
        });
        await alert.present();

      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Error al generar la sala de chat.',
          buttons: ['OK']
        });
        await alert.present();
      });
    }
  }

  abrirModal(Mid, asociado){
    this.modalCtrl2.create({
      component: CalendarPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        id: Mid,
        color: 'secondary',
        nombre: asociado
      }
    }).then( (modalCtrl2) => modalCtrl2.present());
  }

  openChat(chat) {
    this.modal2.create({
      component: ChatComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        chat
      }
    }).then( (modal2) => modal2.present());
  }

  chatRooms(){
    this.router.navigate(['/chats']);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  Agendar(Aid, Aname, VetId){
    console.log(Aid);
    console.log(Aname);
    console.log(VetId);
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

    this.closeModal();
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
                          this.afs.authState.subscribe( userL => {
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
                                VetDetailPage.saveTodo(
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
                        this.closeModal();
                      } else if (data === '2'){
                        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        VetDetailPage.saveTodo(uid, eUid, vName, null, random, 'CASH', 'CASH', null, 'APPROVED', price * 100, direction, pData);
          
                        this.closeModal();
          
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
