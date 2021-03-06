import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Componente } from './interfaces/interfaces';
import { Observable } from 'rxjs';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { usersM } from './models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatsPage } from './pages/chats/chats.page';
import { UsersService } from './services/users.service';
import { Router } from '@angular/router';
import { PetdataPage } from './pages/petdata/petdata.page';
import { firestore, auth } from 'firebase';

import * as firebase from 'firebase/app';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { DevicesService } from './services/devices.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  componentes: Observable<Componente[]>;

  hasVerifiedEmail = true;
  sentTimeStamp;

  public user$: Observable<usersM> = this.afAuth.user;
  isPetData: any;
  userAnalitics: usersM;
  nameAnalitics: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataService: DataService,
    public auth: AuthService,
    public afAuth: AngularFireAuth,
    private modal: ModalController,
    private loadingController: LoadingController,
    private userService: UsersService,
    private router: Router,
    private fcm: FCM,
    private firestore: AngularFirestore,
    private devicesService: DevicesService,
    private alertController: AlertController,
  ) {
    this.initializeApp();
  }

  user;
  uid;
  rol;
  imageUrl;
  isActive;

  async ngAfterViewInit(){
  }

  async initializeApp() {

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

          this.isActive = this.user.isActive;
          this.rol = this.user.rol;
          this.nameAnalitics = res.name +' '+ res.lastname;

          // Google Analytics
          firebase.analytics().logEvent('eventname', {
            'firsttimeuser': true,
            'username': this.nameAnalitics
          });

          if (this.rol === 'user') {
            this.isPetData = this.user.isPetData;
            if (this.isPetData === false) {
              this.modal.create({
                component: PetdataPage,
                cssClass: 'my-custom-modal-css',
                componentProps: {
                  uid: this.uid
                }
              }).then( (modal) => modal.present());
            }
          }

          this.imageUrl = this.user.imageUrl;
          console.log('logeado');
          console.log('Activo:' + this.isActive);
        });
      } else {
        loading.dismiss();
        console.log('not loging');

        // Google Analytics
        firebase.analytics().logEvent('eventname', {
          'firsttimeuser': true,
          'username': 'No Conectado'
        });
      }
    });

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.statusBar.backgroundColorByHexString('#feca06');

      this.componentes = this.dataService.getMenuOpts();
      
      // FCM
      if (this.platform.is('cordova')) {
        this.afAuth.authState.subscribe( userL => {
          if (userL) {
            const uid = userL.uid;
            console.log(this.uid);

            // get FCM token
            this.fcm.getToken().then(token => {

              console.log('El getToken es: ' + token);
              const docData = {
                token: token,
                userId: uid,
              }

              this.devicesService.getDevicesByUid(uid).subscribe ( res => {
                if (res = []){
                  const firebase = firestore().collection('devices').doc(uid);
                  firebase.set(docData);
                } else{
                  this.devicesService.Todos(uid).update({
                    token: token,
                  });
                }
              });

            }).catch( err => {
                console.log(err);
            });

            // ionic push notification example
            this.fcm.onNotification().subscribe(async data => {
              console.log(data);
              if (data.wasTapped) {
                console.log('Received in background');
                const location = window.location.pathname.toString()
                if (location === '/chats'){
                  
                } else if(data.landing_page='chats'){
                  this.userService.getTodo(data.eUid).subscribe( async res =>{ 
                    const alert = await this.alertController.create({
                      header: 'Nuevo mensaje de ' + res.name,
                      mode: 'ios',
                      buttons: [
                        {
                          text: 'CANCELAR',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {
                            console.log('Confirm Cancel');
                          }
                        }, {
                          text: 'Ir a los chats',
                          handler: () => {
                            this.router.navigate([data.landing_page]);
                          }
                        }
                      ]
                    });
                    await alert.present();
                  });
                }
                
              } else {
                console.log('Received in foreground');
                const location = window.location.pathname.toString()
                if (location === '/chats'){

                } else if(data.landing_page='chats'){
                  this.userService.getTodo(data.eUid).subscribe( async res =>{ 
                    const alert = await this.alertController.create({
                      header: 'Nuevo mensaje de ' + res.name,
                      mode: 'ios',
                      buttons: [
                        {
                          text: 'CANCELAR',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {
                            console.log('Confirm Cancel');
                          }
                        }, {
                          text: 'Ir a los chats',
                          handler: () => {
                            this.router.navigate([data.landing_page]);
                          }
                        }
                      ]
                    });
                    await alert.present();
                  });
                }
              }
            });      

            // refresh the FCM token
            this.fcm.onTokenRefresh().subscribe(token => {
              console.log('Ontoken refresh: ' + token);
            });

            // unsubscribe from a topic
            // this.fcm.unsubscribeFromTopic('offers');
          } else if(!this.platform.is('cordova')){
            // PWA
          }
        
        });
      }
    });
  }

  async ngOnInit() {
    this.afAuth.authState.subscribe( async user => {
      if (user) {
        this.hasVerifiedEmail = (await this.afAuth.currentUser).emailVerified;
      }
    });
  }

  async sendVerificationEmail(){
    await (await this.afAuth.currentUser).sendEmailVerification();
    this.sentTimeStamp = new Date();
  }

  reload(){
    window.location.reload();
  }

  OnLogout() {
    this.auth.logOut();
    this.reload();
  }

  chatRooms(){
    this.router.navigate(['/chats']);
  }

}
