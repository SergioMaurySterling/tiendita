import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TerminosPage } from '../terminos/terminos.page';

declare var google;

@Component({
  selector: 'app-registeremp',
  templateUrl: './registeremp.page.html',
  styleUrls: ['./registeremp.page.scss'],
})
export class RegisterempPage implements OnInit {

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
  name: string;
  nit: string;
  lastname: string;
  phone: string;
  direction: string;
  description: string;
  horario: string;
  website: string;
  rol: string;
  date: string;
  isActive: boolean;
  rate: number;
  delivery: number;
  terminos = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private alertController: AlertController,
    public router: Router,
    public modalCtrl: ModalController,
    private zone: NgZone,
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
    this.directionForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      nit: ['', Validators.required],
      phone: ['', Validators.required],
      autocomplete: ['', Validators.required],
      direction: ['', Validators.required],
      terminos: [''],
      delivery: [''],
      description: [''],
      horario: [''],
      website: [''],
    });
  }

  async onSubmitRegister() {

    if (this.terminos === true) {
      if (this.delivery === undefined){
        this.delivery = null;
      }
      if (this.description === undefined){
        this.description = '';
      }
      if (this.horario === undefined){
        this.horario = '';
      }
      if (this.website === undefined){
        this.website = '';
      }
      this.auth.registerEmp(
        this.imageUrl,
        this.email,
        this.password,
        this.name,
        this.lastname,
        this.nit,
        this.phone,
        this.geo,
        this.latitude,
        this.longitude,
        this.direction,
        this.delivery,
        this.description,
        this.horario,
        this.website,
        this.rol = 'emp',
        this.isActive = false,
        this.rate = 5,
        this.date = new Date().toString()
        ).then( async auth => {
          const alert = await this.alertController.create({
            message: 'Datos almacenados correctamente.',
            buttons: ['OK']
          });
          await alert.present();
        this.router.navigate(['/']);
      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          message: 'Este usuario ya se encuentra registrado',
          buttons: ['OK']
        });
        await alert.present();
      });
    } else{
      const alert = await this.alertController.create({
        message: 'No ha aceptado los terminos y condiciones.',
        buttons: ['OK']
      });
      await alert.present();
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
