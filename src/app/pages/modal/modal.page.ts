import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TodoService } from 'src/app/services/todo.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { ChatsService } from '../../services/chats.service';
import { Router } from '@angular/router';
import { ChatsPage } from '../chats/chats.page';
import { firestore } from 'firebase/app';
import { ChatComponent } from 'src/app/components/chat/chat.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() color;
  @Input() nombre;
  @Input() id;

  constructor(
    private modalCtrl: ModalController,
    private modal2: ModalController,
    private alertController: AlertController,
    private todoService: TodoService,
    private loadingController: LoadingController,
    public afs: AngularFireAuth,
    private userService: UsersService,
    private chatsService: ChatsService,
    public router: Router,
  ) {}

  todos;
  user;
  imageUrl;
  petName;
  age;
  city;
  description;
  userName;
  userUid;
  thisUserUid;
  date;

  receptorName;
  receptorUid;

  emisorName;
  emisorUid;
  chatRoomDate;

  likeType;
  dislikeType;
  heartPorcent;

  chat;
  oneChat;

  async ngOnInit() {
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

    this.todoService.getTodo(this.id).subscribe(async res => {
      loading.dismiss();
      this.todos = res;

      this.imageUrl = res.imageUrl;
      this.petName = res.petName;
      this.age = res.age;
      this.city = res.city;
      this.description = res.description;
      this.userName = res.userName;
      this.receptorName = res.userName;
      this.date = res.date;
      this.receptorUid = res.userUid;
      this.userUid = res.userUid;

      this.likeType = res.likes.includes(this.thisUserUid) ? 'heart' : 'heart-outline';
      this.dislikeType = res.dislikes.includes(this.thisUserUid) ? 'heart-dislike' : 'heart-dislike-outline';

      this.heartPorcent = (res.likes.length + res.dislikes.length - res.dislikes.length) / (res.likes.length + res.dislikes.length) * 100;

      this.chatsService.getChatByUserEmpColor((await this.afs.currentUser).uid, this.receptorUid, this.color).subscribe(res2 => {
        this.chat = res2;

        this.oneChat = this.chat.shift();
        loading.dismiss();
      });
    });

  }

  likes(){
    if (this.likeType === 'heart-outline'){
      this.todoService.Todos(this.id).update({
        likes: firestore.FieldValue.arrayUnion(this.thisUserUid),
        dislikes: firestore.FieldValue.arrayRemove(this.thisUserUid)
      });
    } else {
      this.todoService.Todos(this.id).update({
        likes: firestore.FieldValue.arrayRemove(this.thisUserUid),
        dislikes: firestore.FieldValue.arrayUnion(this.thisUserUid)
      });
    }
  }

  dislike(){
    if (this.dislikeType === 'heart-dislike-outline'){
      this.todoService.Todos(this.id).update({
        likes: firestore.FieldValue.arrayRemove(this.thisUserUid),
        dislikes: firestore.FieldValue.arrayUnion(this.thisUserUid)
      });
    } else {
      this.todoService.Todos(this.id).update({
        likes: firestore.FieldValue.arrayUnion(this.thisUserUid),
        dislikes: firestore.FieldValue.arrayRemove(this.thisUserUid)
      });
    }
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
        chatColor: this.color,
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
