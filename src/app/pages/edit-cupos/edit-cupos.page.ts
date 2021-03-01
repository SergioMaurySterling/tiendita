import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { CalendarService } from '../../services/calendar.service';
import { Calendar } from '../../models/calendar';
import moment from 'moment';
import { firestore, auth } from 'firebase';

@Component({
  selector: 'app-edit-cupos',
  templateUrl: './edit-cupos.page.html',
  styleUrls: ['./edit-cupos.page.scss'],
})
export class EditCuposPage implements OnInit {

  todos;
  duplic;
  todoId = null;
  startTime;
  endTime;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    private storage: AngularFireStorage,
    private calendarService: CalendarService,
    private alertController: AlertController,
  ) {
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

    this.calendarService.getTodoByEmisor(this.todoId).subscribe( res => {
      this.todos = res;
      console.log(this.todos);
      loading.dismiss();
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onRemove(item){
    this.calendarService.removeTodo(item.uid);
  }

  async duplicate(uid){

    const alert = await this.alertController.create({
      header: 'Cancelar',
      inputs: [
        {
          name: 'name1',
          type: 'number',
          min: 0,
          placeholder: 'Días en que duplicara la operación',
        },
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {

            if (data && data.name1 !== null) {

              let num = parseInt(data.name1);

              this.calendarService.getTodo(uid).subscribe( res => {
                this.duplic = res;
          
                this.startTime = res.startTime;
                this.startTime = moment.unix(this.startTime.seconds).toDate();
                var startDate = new Date(this.startTime);
                startDate.setDate(startDate.getDate() + num);
          
                this.endTime = res.endTime;
                this.endTime = moment.unix(this.endTime.seconds).toDate();
                var endDate = new Date(this.endTime);
                endDate.setDate(endDate.getDate() + num);

                const saveTodo: Calendar = {
                  title: res.title,
                  allDay: res.allDay,
                  catId: res.catId,
                  cupos: res.cupos,
                  desc: res.desc,
                  emisorName: res.emisorName,
                  emisorUid: res.emisorUid,
                  price: res.price,
                  product: res.product,
                  startTime: startDate,
                  endTime: endDate,
                  Date: new Date().toString()
                }

                const firebase = firestore().collection('calendar');
                firebase.add(saveTodo);
              });
            }
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          }
        }
      ]
    });
    await alert.present();
  }

}
