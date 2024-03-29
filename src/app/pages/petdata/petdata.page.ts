import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-petdata',
  templateUrl: './petdata.page.html',
  styleUrls: ['./petdata.page.scss'],
})
export class PetdataPage implements OnInit {

  @Input() uid;
  trigger = false;
  directionForm: FormGroup;

  petImage;
  petName;
  petSize;
  petRace;
  petAge;
  petFur;
  petObservations;

  selectedFile: any;
  loading: HTMLIonLoadingElement;
  todoId: any;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public router: Router,
    private userService: UsersService,
    public platform: Platform,
  ) {
    this.validatorsForms();
  }

  validatorsForms(){
    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        petImage: [''],
        petName: [''],
        petSize: [''],
        petRace: [''],
        petAge: [''],
        petFur: [''],
        petObservations: ['']
      });
    } else {
      this.directionForm = this.formBuilder.group({
        petImage: ['', Validators.required],
        petName: ['', Validators.required],
        petSize: ['', Validators.required],
        petRace: ['', Validators.required],
        petAge: ['', Validators.required],
        petFur: ['', Validators.required],
        petObservations: ['', Validators.required]
      });
    }
  }

  ngOnInit() {
    this.todoId = this.uid;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  addPet(){
    this.trigger = true;
  }

  chooseFile(event) {
    this.selectedFile = event.target.files;
  }

  async saveTodo(){

    if (!this.platform.is('ios')) {
      if(this.petImage === undefined || this.petImage === null) {
        const alert = await this.alertController.create({
          mode: 'ios',
          message: 'Agregue una imagen',
          buttons: ['OK']
        });
        await alert.present();
  
      }
    } 
    
    if (this.petName === undefined || this.petName === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue un nombre',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.petSize === undefined || this.petSize === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Seleccione el tamaño',
        buttons: ['OK']
      });
      await alert.present();
      
    } else if (this.petRace === undefined || this.petRace === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue una Raza',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.petAge === undefined || this.petAge === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la edad',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.petFur === undefined || this.petFur === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Seleccione el pelaje',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.petObservations === undefined || this.petObservations === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue las observaciones',
        buttons: ['OK']
      });
      await alert.present();

    } else {
      const loading = await this.loadingController.create({
        mode: 'ios',
        message: 'Actualizando...'
      });
      await loading.present();
      if (this.todoId) {
        this.userService.Todos(this.todoId).update({
          petName: this.petName,
          petSize: this.petSize,
          petRace: this.petRace,
          petAge: this.petAge,
          petFur: this.petFur,
          petObservations: this.petObservations,
          isPetData: true
        });
      
        if (this.selectedFile){
          const petImage = await this.uploadFile(this.todoId, this.selectedFile);
  
          this.userService.Todos(this.todoId).update({
            petImage: petImage || null
          });
        }
  
        const alert = await this.alertController.create({
          message: 'Datos actualizados correctamente.',
          buttons: ['OK']
        });
        await alert.present();
        loading.dismiss();
        this.router.navigate(['/']);
  
        this.closeModal();
  
      } else {
        this.router.navigate(['/login']);
      }
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Please wait...'
    });
    return this.loading.present();
  }

  remove(item){
    if (item.imageUrl) {
      this.storage.ref(`images/${item.id}`).delete();
    }
    this.userService.removeTodo(item.id);
  }

}
