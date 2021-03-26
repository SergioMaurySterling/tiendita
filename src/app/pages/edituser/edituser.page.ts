import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersE } from 'src/app/models/user';
import { UsersService } from '../../services/users.service';

declare var google;

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.page.html',
  styleUrls: ['./edituser.page.scss'],
})
export class EdituserPage implements OnInit {

  autocomplete;
  autocompleteItems: any[];
  GoogleAutocomplete: any;

  service = new google.maps.places.AutocompleteService();

  geo;

  directionForm: FormGroup;

  imageUrl: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  nit: string;
  phone: string;
  googleDir: string;
  latitude = 0;
  longitude = 0;
  direction: string;
  delivery: number;
  description: string;
  horario: string;
  website: string;

  petImage: string;
  petName: string;
  petSize: string;
  petRace: string;
  petAge: string;
  petFur: string;
  petObservations: string;

  uid;
  user;
  rol;

  selectedFile: any;
  loading: HTMLIonLoadingElement;

  todo: UsersE = {};
  todoId = null;
  isPetData: any;
  selectedFile2: any;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    public af: AngularFireAuth,
    private storage: AngularFireStorage,
    private userService: UsersService,
    private zone: NgZone,
  ) {
    this.validatorsForms();

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  validatorsForms(){
    this.directionForm = this.formBuilder.group({
      imageUrl: [''],
      name: [''],
      lastname: [''],
      nit: [''],
      phone: [''],
      autocomplete: [''],
      direction: [''],
      delivery: [''],
      description: [''],
      horario: [''],
      website: [''],

      petImage: [''],
      petName: [''],
      petSize: [''],
      petRace: [''],
      petAge: [''],
      petFur: [''],
      petObservations: [''],
    });
  }

  async ngOnInit() {
    this.todoId = this.route.snapshot.params.id;
    if (this.todoId) {
      this.loadTodo();
    }

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.af.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        this.userService.getTodo(this.uid).subscribe(res => {
          loading.dismiss();
          this.user = res;

          this.isPetData = this.user.isPetData;
          this.rol = this.user.rol;
          console.log('logeado');
        });
      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });
  }

  async loadTodo(){
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo(this.todoId).subscribe( res => {
      this.todo = res;
      loading.dismiss();

      this.geo = this.todo.googleDir;
      this.latitude = this.todo.latitude;
      this.longitude = this.todo.longitude;

      this.autocomplete.query = this.todo.googleDir;
    });
  }

  chooseFile(event) {
    this.selectedFile = event.target.files;
  }

  chooseFile2(event) {
    this.selectedFile2 = event.target.files;
  }

  async saveTodo(){
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Actualizando...'
    });
    await loading.present();

    if (this.todoId) {
      this.userService.updateTodo(this.todo, this.todoId).then( async  res => {

        loading.dismiss();

        this.userService.Todos(this.todoId).update({
          id: this.todoId,
          latitude: this.latitude,
          longitude: this.longitude,
          googleDir: this.geo
        });

        if (this.selectedFile){
          const imageUrl = await this.uploadFile(this.todoId, this.selectedFile);
          const petImage = this.todo.petImage;

          this.userService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: imageUrl || null,
            petImage: petImage || null,
          });
        } else {
          this.userService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: this.todo.imageUrl,
            petImage: this.todo.petImage || null,
          });
        }

        if (this.selectedFile2){
          const petImage = await this.uploadFile2(this.todoId, this.selectedFile2);

          this.userService.Todos(this.todoId).update({
            id: this.todoId,
            petImage: petImage || null
          });
        } else {
          this.userService.Todos(this.todoId).update({
            id: this.todoId,
            petImage: this.todo.petImage
          });
        }

        const alert = await this.alertController.create({
          message: 'Datos actualizados correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/']);
      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          message: 'Error al almacenar los datos.',
          buttons: ['OK']
        });
        await alert.present();
      });
    } else{
      alert ('Operacion Invalida');
    }
  }

  async uploadFile(id, file): Promise<any> {
    if (file && file.length) {
      try {
        await this.presentLoading();
        const task = await this.storage.ref('images').child(id).put(file[0]);
        this.loading.dismiss();
        return this.storage.ref(`images/${id}`).getDownloadURL().toPromise();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async uploadFile2(id2, file2): Promise<any> {
    if (file2 && file2.length) {
      try {
        await this.presentLoading();
        const task = await this.storage.ref('images2').child(id2).put(file2[0]);
        this.loading.dismiss();
        return this.storage.ref(`images2/${id2}`).getDownloadURL().toPromise();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Subiendo imagen...'
    });
    return this.loading.present();
  }

  remove(item){
    if (item.imageUrl) {
      this.storage.ref(`images/${item.id}`).delete();
    }
    this.userService.removeTodo(item.id);
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

}
