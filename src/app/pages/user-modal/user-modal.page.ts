import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  @Input() userId;
  rate: any;
  isPetData: any;

  constructor(
    private userService: UsersService,
    public af: AngularFireAuth,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    public router: Router,
    private modal2: ModalController,
    private chatsService: ChatsService,
    private modalCtrl2: ModalController,
    private alertController: AlertController,
  ) { }

  uid;
  user;
  nombre;
  imageUrl;

  receptorName;
  receptorUid;

  emisorName;
  emisorUid;
  chatRoomDate;

  todos;

  chat;
  oneChat;

  nit;
  description;
  email;
  rol;
  direction;
  horario;
  color;

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.color = 'primary';

    this.af.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        this.userService.getTodo(this.userId).subscribe(res => {
          loading.dismiss();
          this.user = res;
          this.isPetData = this.user.isPetData;
          this.email = this.user.email;
          this.rol = this.user.rol;
          this.imageUrl = this.user.imageUrl;

          this.receptorName = this.user.name + ' ' + this.user.lastname;
          this.receptorUid = this.user.uid;

          this.chatsService.getChatByUserEmpColor( this.uid, this.receptorUid, this.color).subscribe(res2 => {
            this.chat = res2;

            this.oneChat = this.chat.shift();
            loading.dismiss();
          });

          if (this.user.rol === 'emp'){
            this.nombre = this.user.name;
            this.nit = this.user.nit;
            this.description = this.user.description;
            this.direction = this.user.direction;
            this.horario = this.user.horario;
            this.rate = this.user.rate;
          } else {
            this.nombre = this.user.name + ' ' + this.user.lastname;
          }
        });

        this.userService.getTodo(this.uid).subscribe(async res => {
          loading.dismiss();
          this.todos = res;

          this.emisorName = this.todos.name + ' ' + this.todos.lastname;
          this.emisorUid = this.todos.uid;

        });

      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  openChat(chat) {
    this.modal2.create({
      component: ChatComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        chat
      }
    }).then( (modal2) => modal2.present());
  }

  chatRooms(){
    this.router.navigate(['/chats']);
  }

  AddChatRoom(){
    if (this.oneChat){
      this.openChat(this.oneChat);
    } else{
      const eventCopy = {
        receptorName: this.receptorName,
        receptorUid: this.receptorUid,
        emisorName: this.emisorName,
        emisorUid: this.emisorUid,
        chatColor: 'dark',
        chatRoomDate: new Date().toString()
      };

      this.chatsService.addTodo(eventCopy).then( async res => {

        const chat = res;
        this.openChat(chat);
        this.closeModal();
        this.chatRooms();

        const alert = await this.alertController.create({
          message: 'Se ha creado la nueva sala de chat con ' + this.receptorName,
          buttons: ['OK']
        });
        await alert.present();

      }).catch(async err => {
        console.log(err);
        const alert = await this.alertController.create({
          message: 'Error al generar la sala de chat.',
          buttons: ['OK']
        });
        await alert.present();
      });
    }
  }

}
