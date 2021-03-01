import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Product } from 'src/app/models/product';
import { ProductService } from '../../services/product.service';
import { ProductCatService } from './../../services/product-cat.service';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-editproducts',
  templateUrl: './editproducts.page.html',
  styleUrls: ['./editproducts.page.scss'],
})
export class EditproductsPage implements OnInit {

  directionForm: FormGroup;
  images;
  name;
  ProdcutCatId;
  price;
  delprice;
  description;

  selectedFile: any;
  loading: HTMLIonLoadingElement;

  todo: Product = {};
  category;
  todoId = null;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private nav: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    private storage: AngularFireStorage,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private imagesService: ImagesService,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      images: [''],
      name: ['', Validators.required],
      ProdcutCatId: ['', Validators.required],
      price: ['', Validators.required],
      delprice: [''],
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
      message: 'Cargando...'
    });
    await loading.present();

    this.imagesService.getTodoByProduct(this.todoId).subscribe( res => {
      this.images = res;
      console.log(this.images);
      loading.dismiss();
    });

    this.productService.getTodo(this.todoId).subscribe( res => {
      this.todo = res;

      loading.dismiss();
    });

    this.productCatService.getTodos().subscribe(res => {
      this.category = res;
      loading.dismiss();
    });
  }

  chooseFile(event) {
    this.selectedFile = event.target.files;
  }

  async saveTodo(){
    const loading = await this.loadingController.create({
      message: 'Actualizando...'
    });
    await loading.present();

    if (this.todoId) {
      this.productService.updateTodo(this.todo, this.todoId).then( async  res => {

        loading.dismiss();

        if (this.delprice){
          this.productService.Todos(this.todoId).update({
            id: this.todoId,
            delprice: this.delprice
          });
        } else {
          this.productService.Todos(this.todoId).update({
            id: this.todoId,
            delprice: this.todo.delprice
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
      const alert = await this.alertController.create({
        message: 'Operación invalida.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
