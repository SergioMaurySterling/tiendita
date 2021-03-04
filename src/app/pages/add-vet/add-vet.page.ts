import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modals } from '../../models/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { VetCareService } from '../../services/vetcare.service';
import { VetCare } from '../../models/vetCare';
import { VetCatService } from '../../services/vet-cat.service';

@Component({
  selector: 'app-add-vet',
  templateUrl: './add-vet.page.html',
  styleUrls: ['./add-vet.page.scss'],
})
export class AddVetPage implements OnInit {

  directionForm: FormGroup;
  asociadoDescription: string;
  catId: string;
  catName: string;
  imageUrl: string;

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
    private todoService: VetCareService,
    private userService: UsersService,
    private categoryService: VetCatService,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
  ) {
    this.validatorsForms();
  }

  category;
  category2;
  user = null;
  name;
  lastname;
  thisUserUid;
  asociadoIUrl;

  namevet;
  price;
  typeservice;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;

      this.name = this.user.name;
      this.lastname = this.user.lastname;
      this.thisUserUid = this.user.uid;
      this.asociadoIUrl = this.user.imageUrl;
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

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      imageUrl: ['', Validators.required],
      namevet: ['', Validators.required],
      price: ['', Validators.required],
      typeservice: ['', Validators.required],
      catId: ['', Validators.required],
      asociadoDescription: ['', Validators.required],
    });
  }

  chooseFile(event) {
    this.selectedFile = event.target.files;
  }

  async CatName(){
    this.categoryService.getTodo(this.catId).subscribe(res => {
      this.category2 = res;
      this.catName = this.category2.name;

      this.saveTodo(this.catName);
    });
  }

  async saveTodo(catname) {

    const saveTodo: VetCare = {
      name: this.namevet,
      price: this.price,
      typeservice: this.typeservice,
      asociadoID: this.thisUserUid,
      isActive: true,
      amountVent: 0,
      catId: this.catId,
      catName: catname,
      asociadoDescription: this.asociadoDescription,
      color: this.color,

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
      this.router.navigate(['/vet']);
    }).catch(async err =>
      {
        console.log(err);
        const alert = await this.alertController.create({
          message: 'Error al almacenar los datos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );

    this.closeModal();
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
