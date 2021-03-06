import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { TodoService } from 'src/app/services/todo.service';
import { Modals } from 'src/app/models/modal';

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.page.html',
  styleUrls: ['./editmodal.page.scss'],
})
export class EditmodalPage implements OnInit {

  directionForm: FormGroup;
  petName: string;
  age: string;
  city: string;
  description: string;
  imageUrl: string;
  situation;

  selectedFile: any;
  loading: HTMLIonLoadingElement;

  todo: Modals = {};
  todoId = null;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private nav: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    public router: Router,
    private storage: AngularFireStorage,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      imageUrl: [''],
      petName: ['', Validators.required],
      situation: [''],
      age: ['', Validators.required],
      city: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.todoId = this.route.snapshot.params.id;
    if (this.todoId) {
      this.loadTodo();
    }
  }

  async loadTodo(){
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.todoService.getTodo(this.todoId).subscribe( res => {
      this.todo = res;
      loading.dismiss();
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
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
      this.todoService.updateTodo(this.todo, this.todoId).then( async  res => {

        loading.dismiss();

        if (this.selectedFile){
          const imageUrl = await this.uploadFile(this.todoId, this.selectedFile);

          this.todoService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: imageUrl || null
          });
        } else {
          this.todoService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: this.todo.imageUrl
          });
        }

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
    }else{
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
    this.todoService.removeTodo(item.id);
  }

}
