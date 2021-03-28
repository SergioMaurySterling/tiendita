import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modals } from '../../models/modal';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-addmodal',
  templateUrl: './addmodal.page.html',
  styleUrls: ['./addmodal.page.scss'],
})
export class AddmodalPage implements OnInit {

  directionForm: FormGroup;
  petName: string;
  age: string;
  city: string;
  description: string;
  imageUrl: string;
  st;

  selectedFile: any;

  @Input() color;
  @Input() nombre;

  loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    public af: AngularFireAuth,
    public router: Router,
    private todoService: TodoService,
    private userService: UsersService,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    public platform: Platform,
  ) {
    this.validatorsForms();
  }

  user = null;
  name;
  lastname;
  thisUserUid;
  situation;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;

      this.name = this.user.name;
      this.lastname = this.user.lastname;
      this.thisUserUid = this.user.uid;
      loading.dismiss();
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  validatorsForms() {
    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        petName: [''],
        situation: [''],
        age: [''],
        city: [''],
        description: [''],
        imageUrl: ['']
      });
    } else{
      if (this.color === 'primary') {
        this.directionForm = this.formBuilder.group({
          petName: ['', Validators.required],
          situation: ['', Validators.required],
          age: ['', Validators.required],
          city: ['', Validators.required],
          description: ['', Validators.required],
          imageUrl: ['', Validators.required]
        });
      } else {
        this.directionForm = this.formBuilder.group({
          petName: ['', Validators.required],
          situation: [''],
          age: ['', Validators.required],
          city: ['', Validators.required],
          description: ['', Validators.required],
          imageUrl: ['', Validators.required]
        });
      }
    }
  }

  chooseFile(event) {
    this.selectedFile = event.target.files;
  }

  async saveTodo() {

    if (this.petName === undefined || this.petName === null) {
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue el nombre de la mascota',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.color === 'primary'){
      if (this.situation === undefined || this.situation === null) {
        const alert = await this.alertController.create({
          mode: 'ios',
          message: 'Agregue la situación de la mascota',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (this.age === undefined || this.age === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la edad de la mascota',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.city === undefined || this.city === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la ciudad',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.description === undefined || this.description === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la descripción',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.imageUrl === undefined || this.imageUrl === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue la imagen',
        buttons: ['OK']
      });
      await alert.present();
    } else{
      if (this.nombre === 'Perdidos') {
        this.st = this.situation;
      } else {
        this.st = null;
      }
      const saveTodo: Modals = {
        color: this.color,
        userUid: this.thisUserUid,
        userName: this.name + ' ' + this.lastname,
        petName: this.petName,
        situation: this.st,
        age: this.age,
        city: this.city,
        description: this.description,
        likes: [],
        dislikes: [],
        isActive: true,
        date: new Date().toString()
      };
      this.todoService.addTodo(saveTodo).then( async  res => {
  
        const imageUrl = await this.uploadFile(res.id, this.selectedFile);
  
        this.todoService.Todos(res.id).update({
          id: res.id,
          imageUrl: imageUrl || null
        });
  
        const alert = await this.alertController.create({
          message: 'Datos almacenados correctamente.',
          buttons: ['OK']
        });
        await alert.present();
  
        this.router.navigate(['/mymodals']);
      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          message: 'Error al almacenar los datos.',
          buttons: ['OK']
        });
        await alert.present();
      });
      this.closeModal();
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
      message: 'Cargando...'
    });
    return this.loading.present();
  }

  remove(item){
    if (item.imageUrl) {
      this.storage.ref(`images/${item.id}`).delete();
    }
    this.todoService.removeTodo(item.id);
  }

}
