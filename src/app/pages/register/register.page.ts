import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { TerminosPage } from '../terminos/terminos.page';

declare var google;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  autocomplete;
  autocompleteItems: any[];
  GoogleAutocomplete: any;

  latitude = 0;
  longitude = 0;
  geo;

  service = new google.maps.places.AutocompleteService();

  directionForm: FormGroup;

  imageUrl = '';
  email: string;
  password: string;
  terminos = false;
  name: string;
  lastname: string;
  phone: string;
  direction: string;
  rol: string;
  date: string;
  isActive: boolean;
  isPetData: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private alertController: AlertController,
    public router: Router,
    public modalCtrl: ModalController,
    private zone: NgZone,
    public platform: Platform,
  ) {
    this.validatorsForms();

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ngOnInit() {
  }

  validatorsForms() {
    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        email: [''],
        password: [''],
        name: [''],
        lastname: [''],
        phone: [''],
        autocomplete: [''],
        direction: [''],
        terminos: [''],
      });
    } else{
      this.directionForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        phone: ['', Validators.required],
        autocomplete: ['', Validators.required],
        direction: ['', Validators.required],
        terminos: [''],
      });
    }
  }

  async onSubmitRegister() {
    if (this.email === undefined || this.email === null) {
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue un email',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.password === undefined || this.password === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue una contraseña',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.name === undefined || this.name === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue el nombre',
        buttons: ['OK']
      });
      await alert.present();
      
    } else if (this.lastname === undefined || this.lastname === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue al menos un apellido',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.phone === undefined || this.phone === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue un telefono',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.autocomplete === undefined || this.autocomplete === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue los datos en mapas',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.direction === undefined || this.direction === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue una dirección',
        buttons: ['OK']
      });
      await alert.present();

    } else {
      if (this.terminos === true) {
        this.auth.register(
          this.imageUrl,
          this.email,
          this.password,
          this.name,
          this.lastname,
          this.phone,
          this.geo,
          this.latitude,
          this.longitude,
          this.direction,
          this.rol = 'user',
          this.isPetData = false,
          this.isActive = true,
          this.date = new Date().toString()
          ).then( async auth => {
            const alert = await this.alertController.create({
              message: 'Usuario agregado exitosamente.',
              buttons: ['OK']
            });
            await alert.present();
          this.router.navigate(['/']);
        }).catch(async err => {
          console.log(err);
          const alert = await this.alertController.create({
            message: err,
            buttons: ['OK']
          });
          await alert.present();
        });
      } else {
        const alert = await this.alertController.create({
          message: 'No ha aceptado los terminos y condiciones.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
    
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

  terminosClick(){
    this.modalCtrl.create({
      component: TerminosPage,
      cssClass: 'my-custom-modal-css'
    }).then( (modalCtrl) => modalCtrl.present());
  }

}
