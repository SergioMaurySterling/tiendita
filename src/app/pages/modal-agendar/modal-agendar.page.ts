import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firestore, auth } from 'firebase';
import { Pay } from '../../models/pay';
import { environment } from 'src/environments/environment';
import { VetCareService } from 'src/app/services/vetcare.service';
import { UsersService } from 'src/app/services/users.service';

declare var WidgetCheckout: any;

@Component({
  selector: 'app-modal-agendar',
  templateUrl: './modal-agendar.page.html',
  styleUrls: ['./modal-agendar.page.scss'],
})
export class ModalAgendarPage implements OnInit {

  directionForm: FormGroup;

  @Input() color;
  @Input() nombre;
  @Input() id;
  @Input() catId;
  @Input() vetId;

  todos;
  payMethod;
  user;

  constructor(
    private modalCtrl: ModalController,
    private calendarService: CalendarService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private alertController3: AlertController,
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public router: Router,
    public af: AngularFireAuth,
    private userService: UsersService,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      payMethod: ['', Validators.required]
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.calendarService.getTodoByCatidEmisorUidCupos(this.vetId, this.id).subscribe(async res => {
      loading.dismiss();
      this.todos = res;
    });

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;
      loading.dismiss();
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async checkout(price, eUid, vName, uid, cp, vvuid) {
    const direction = this.user.direction;
    const vetData = await this.alertController3.create({
      header: 'Observaciones',
      mode: 'ios',
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

              const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

              if (this.payMethod === 'Efectivo') {

                ModalAgendarPage.saveTodo(vvuid, uid, eUid, vName, null, random, 'CASH', 'CASH', null, 'APPROVED', price * 100, pData, direction);

                this.calendarService.Todos(uid).update({
                  cupos: cp - 1,
                });
                this.closeModal();

                const alert = await this.alertController.create({
                  message: 'Producto agregado.',
                  buttons: ['OK']
                });
                await alert.present();

                this.router.navigate(['/historial']);

              } else if (this.payMethod === 'Tarjeta') {

                this.calendarService.Todos(uid).update({
                  cupos: cp - 1,
                });

                this.afAuth.authState.subscribe( userL => {
                  if (userL) {
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
                      ModalAgendarPage.saveTodo(
                        vvuid,
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
                        pData,
                        direction
                      );
                    });
                  } else {
                    console.log('not loging');
                    this.closeModal();
                    this.router.navigate(['/login']);
                  }
                });
              }
            }
          }
        }
      ]
    });
    await vetData.present();

    
    this.closeModal();
  }

  // tslint:disable-next-line: member-ordering
  static saveTodo(vvUid, vUid,eUid, vName, id, reference, pMethodType, pMethod, cData, st, amount, petData, dir) {

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

    this.getVetData(vvUid).then(data => {
      VetCareService.Todos(vvUid).update({
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

}
