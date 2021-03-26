import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { UsersService } from '../../services/users.service';
import { ProductService } from '../../services/product.service';
import { ProductCatService } from '../../services/product-cat.service';
import { firestore } from 'firebase/app';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ImagesService } from '../../services/images.service';
import { MyData } from '../../models/images';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;

  directionForm: FormGroup;

  @Input() color;
  @Input() nombre;

  loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public af: AngularFireAuth,
    public router: Router,
    private todoService: ProductService,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private userService: UsersService,
    private productCatService: ProductCatService,
    private imagesService: ImagesService,
    private alertController: AlertController,
    private database: AngularFirestore,
    private platform: Platform,
  ) {
    this.validatorsForms();

    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('Images');
  }

  user = null;
  productCat;

  selectedFile: any;

  name;
  price;
  delprice;
  ProdcutCatId;
  ProductCatName;
  description;
  amount;
  amountVent;
  date;

  thisUserUid;
  thisUserName;

  pCatId;
  pCatName;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;
      this.thisUserUid = this.user.uid;
      this.thisUserName = this.user.name;
      loading.dismiss();
    });

    this.productCatService.getTodos().subscribe(res => {
      this.productCat = res;
      loading.dismiss();
    });

    this.images = this.imagesService.getTodoByUserInUse((await this.af.currentUser).uid);
  }

  closeModal() {
    
    const img = [this.images];
    for (let index = 0; index < img.length; index++) {
      const element = img[index];
      console.log(img);
    }
    this.modalCtrl.dismiss();
  }

  validatorsForms() {

    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        name: [''],
        price: [''],
        delprice: [''],
        ProdcutCatId: [''],
        description: [''],
      });
    } else {
      this.directionForm = this.formBuilder.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        delprice: [''],
        ProdcutCatId: ['', Validators.required],
        description: ['', Validators.required],
      });

    }
  }

  async SelectCat(){

    if (this.name === undefined || this.name === null) {
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue un nombre',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.price === undefined || this.price === null) {
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue el precio',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.ProdcutCatId === undefined || this.ProdcutCatId === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Seleccione una categoria',
        buttons: ['OK']
      });
      await alert.present();

    } else if (this.description === undefined || this.description === null){
      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Agregue una descripción',
        buttons: ['OK']
      });
      await alert.present();

    } else {
      this.productCatService.getTodo(this.ProdcutCatId).subscribe(res => {
        this.pCatId = res;
        this.pCatName = this.pCatId.name;
  
        this.saveTodo(this.pCatName);
      });
    }
    
  }

  async saveTodo(pcatname) {
    if (this.delprice === undefined){
      this.delprice = '';
    }
    const saveTodo: Product = {
      userUid: this.thisUserUid,
      userName: this.thisUserName,
      name: this.name,
      price: this.price,
      delprice: this.delprice,
      ProdcutCatId: this.ProdcutCatId,
      ProductCatName: pcatname,
      description: this.description,
      isActive: true,
      amount: 1,
      amountVent: 0,

      date: new Date().toString()
    };
    this.todoService.addTodo(saveTodo).then( async  res => {

      this.images.subscribe( res2 => {

        const img = res2.shift();
        if (img) {
          this.todoService.Todos(res.id).update({
            imageUrl: img,
          });
        }
      });

      this.images.subscribe( async res3 => {
        if (res3.length > 0){
          const index = res3.length;
          let i = 0;
          while (i <= index) {
            const element = res3[i];
            if (element) {
              this.imagesService.Todos(element.uid).update({
                inUse: false,
                productUid: res.id
              });
            }
            i++;
            // console.log(element);
          }
        }
      });

      const alert = await this.alertController.create({
        mode: 'ios',
        message: 'Datos almacenados correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      this.reload();
    }).catch(async err =>
      {
        console.log(err);
        const alert = await this.alertController.create({
          mode: 'ios',
          message: 'Error al almacenar los datos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
    this.closeModal();
  }

  uploadFile(event: FileList) {

    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('tipo de archivo no soportado');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    const Mrandom = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // The storage path
    const path = `freakyStorage/${Mrandom}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    // File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            uid: this.database.createId(),
            inUse: true,
            name: file.name,
            filepath: resp,
            size: this.fileSize,
            random: Mrandom,
            userUid: this.thisUserUid,
            date: new Date()
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = image.uid;

    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      // console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }

  onRemove(item){
    if (item.filepath) {
      this.storage.ref(`freakyStorage/${item.random}_${item.name}`).delete();
    }
    this.imagesService.removeTodo(item.uid);
  }

  reload(){
    setTimeout(function () {
      window.location.reload();
    }, 1500);
    
  }

}
