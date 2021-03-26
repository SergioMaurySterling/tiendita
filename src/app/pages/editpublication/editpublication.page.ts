import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { VetCare } from 'src/app/models/vetCare';
import { VetCareService } from '../../services/vetcare.service';
import { VetCatService } from 'src/app/services/vet-cat.service';

@Component({
  selector: 'app-editpublication',
  templateUrl: './editpublication.page.html',
  styleUrls: ['./editpublication.page.scss'],
})
export class EditpublicationPage implements OnInit {

  directionForm: FormGroup;
  asociadoDescription: string;
  imageUrl: string;
  category;
  catId: string;

  name;
  price;
  typeservice;

  @Input() color;
  @Input() nombre;

  selectedFile: any;
  loading: HTMLIonLoadingElement;

  todo: VetCare = {};
  todoId = null;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private vetCareService: VetCareService,
    private categoryService: VetCatService,
    private formBuilder: FormBuilder,
    public router: Router,
    private storage: AngularFireStorage,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      imageUrl: [''],
      name: [''],
      price: [''],
      typeservice: [''],
      catId: [''],
      asociadoDescription: [''],
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

    this.vetCareService.getTodo(this.todoId).subscribe( res => {
      this.todo = res;
      loading.dismiss();
    });

    this.categoryService.getTodos().subscribe(res => {
      this.category = res;
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
      this.vetCareService.updateTodo(this.todo, this.todoId).then( async  res => {

        loading.dismiss();

        if (this.selectedFile){
          const imageUrl = await this.uploadFile(this.todoId, this.selectedFile);

          this.vetCareService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: imageUrl || null
          });
        } else {
          this.vetCareService.Todos(this.todoId).update({
            id: this.todoId,
            imageUrl: this.todo.imageUrl
          });
        }

        const alert = await this.alertController.create({
          message: 'Datos almacenados correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/mypublications']);
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
    this.vetCareService.removeTodo(item.id);
  }

}
