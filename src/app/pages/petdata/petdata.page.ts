import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
  ) {
    this.validatorsForms();
  }

  validatorsForms(){
    this.directionForm = this.formBuilder.group({
      petImage: [''],
      petName: ['', Validators.required],
      petSize: ['', Validators.required],
      petRace: ['', Validators.required],
      petAge: ['', Validators.required],
      petFur: ['', Validators.required],
      petObservations: ['', Validators.required]
    });
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
