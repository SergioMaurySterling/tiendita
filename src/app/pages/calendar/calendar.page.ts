import { Inject, Input, LOCALE_ID, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { UsersService } from 'src/app/services/users.service';
import { formatDate } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { VetCareService } from 'src/app/services/vetcare.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  event = {
    emisorName: '',
    desc: '',
    startTime: '',
    endTime: '',
    cupos: null,
    allDay: false
  };

  todoId = null;
  
  minDate;

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private modalCtrl: ModalController,
    private db: AngularFirestore,
    private alertCtrl: AlertController,
    public usersService: UsersService,
    private todoService: VetCareService,
    private loadingController: LoadingController,
    public afs: AngularFireAuth,
    private userService: UsersService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string
  ) {
  }

  todos;
  user;
  thisUserUid;
  userUid;

  emisorName;
  emisorUid;

  async ngOnInit() {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    this.minDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    this.todoId = this.route.snapshot.params.id;

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.afs.currentUser).uid).subscribe(res => {
      this.user = res;

      this.emisorName = this.user.name + ' ' + this.user.lastname;
      this.emisorUid = this.user.uid;
      this.thisUserUid = this.user.uid;
      loading.dismiss();
    });

    this.todoService.getTodo(this.todoId).subscribe(async res => {
      loading.dismiss();
      this.todos = res;
      this.userUid = res.asociadoID;
    });
    this.resetEvent();
    this.calend();
  }

  calend(){
    this.db.collection('calendar', ref => ref
    .where('catId', '==', this.todoId)).snapshotChanges().subscribe(colSnap => {
      this.eventSource = [];
      colSnap.forEach(snap => {
        const eventCopy: any = snap.payload.doc.data();
        eventCopy.id = snap.payload.doc.id;
        eventCopy.startTime = eventCopy.startTime.toDate();
        eventCopy.endTime = eventCopy.endTime.toDate();
        this.eventSource.push(eventCopy);
      });
    });
  }

  resetEvent() {
    this.event = {
      emisorName: '',
      desc: '',
      cupos: null,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {
    if (this.event.cupos === null){
      this.event.cupos = 1;
    }
    const eventCopy = {
      title: 'Creador por ' + this.emisorName,
      emisorName: this.emisorName,
      emisorUid: this.emisorUid,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc,
      cupos: this.event.cupos,
      catId: this.todoId,
      product: this.todos.name,
      price: this.todos.price,
      Date: new Date().toString()
    };

    if (eventCopy.allDay) {
      const start = eventCopy.startTime;
      const end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();

    this.db.collection('calendar').add(eventCopy);
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: 'Creador: ' + event.emisorName,
      subHeader: event.desc,
      message: 'Inicio: ' + start + '<br><br>Fin: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  // Time slot was clicked
  onTimeSelected(ev) {
    const selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
