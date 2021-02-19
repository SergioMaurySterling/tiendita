import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Calendar } from '../../models/calendar';
import { CalendarService } from '../../services/calendar.service';
import moment from 'moment';

@Component({
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.page.html',
  styleUrls: ['./edit-calendar.page.scss'],
})
export class EditCalendarPage implements OnInit {

  directionForm: FormGroup;

  allDay;
  startTime;
  endTime;
  cupos;
  emisorUid;

  todo: Calendar = {};
  todoId = null;
  catId: string;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private nav: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    private storage: AngularFireStorage,
    private calendarService: CalendarService,
  ) {
    this.validatorsForms();
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      allDay: [''],
      startTime: [''],
      endTime: [''],
      cupos: [''],
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

    this.calendarService.getTodo(this.todoId).subscribe( res => {
      this.todo = res;

      this.catId = res.catId;
      this.emisorUid = res.emisorUid;
      this.allDay = res.allDay;
      this.startTime = res.startTime;
      this.endTime = res.endTime;
      this.cupos = res.cupos;

      this.startTime = moment.unix(this.startTime.seconds).format('YYYY-MM-DDTHH:mm');
      this.endTime = moment.unix(this.endTime.seconds).format('YYYY-MM-DDTHH:mm');
      console.log(this.startTime + ' ' + this.endTime);

      loading.dismiss();
    });
  }

  doStart(date) {
    console.log(date);
  }

  doEnd(date) {
    console.log(date);
  }

  async saveTodo(){
    const loading = await this.loadingController.create({
      message: 'Actualizando...'
    });
    await loading.present();

    if (this.todoId) {
      this.calendarService.Todos(this.todoId).update({
        allDay: this.allDay,
        startTime: new Date(this.startTime),
        endTime: new Date(this.endTime),
        cupos: this.cupos,
      }).then( async  res => {
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Datos almacenados correctamente.',
          buttons: ['OK']
        });
        await alert.present();
        
        this.router.navigate(['/editCupos/' + this.catId]);
        
      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Error al almacenar los datos.',
          buttons: ['OK']
        });
        await alert.present();
      });
    }else{
      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Operación invalida.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
