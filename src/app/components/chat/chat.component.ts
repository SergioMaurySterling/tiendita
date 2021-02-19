import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, LoadingController } from '@ionic/angular';
import { message } from 'src/app/models/message';
import { ChatsService } from 'src/app/services/chats.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonContent } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  @ViewChild(IonContent, {read: IonContent, static: false}) myContent: IonContent;
  public chat: any;
  public messages = [];
  public room: any;
  public msg: string;

  constructor(
    private navparams: NavParams,
    private modal: ModalController,
    private loadingController: LoadingController,
    private chatService: ChatsService,
    public af: AngularFireAuth,
    private userService: UsersService,
  ) { }

  user = null;
  public name;
  public lastname;
  public rol;
  public username;
  public color;
  public useruid;
  public provisionalName;

  async ngOnInit() {

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.chatService.getChatRoom( this.chat.id ).subscribe( room => {
      loading.dismiss();
      // console.log(room);
      this.room = room;
    });
    this.chat = this.navparams.get('chat');

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;
      // console.log(this.user);

      this.useruid = this.user.uid;
      this.name = this.user.name;
      this.lastname = this.user.lastname;
      this.rol = this.user.rol;
      this.username = this.user.email;
      loading.dismiss();
    });
    this.scrollToBottomOnInit();
  }

  closeChat() {
    this.modal.dismiss();
  }

  sendMessage() {
    if (this.rol === 'user') {
      this.color = 'success';
      this.provisionalName = this.name + ' ' + this.lastname;
    } else {
      this.color = 'secondary';
      this.provisionalName = this.name;      
    }
    const mensaje: message = {
      color: this.color,
      name: this.provisionalName,
      username: this.username,
      useruid: this.useruid,
      content: this.msg,
      date: new Date().toString()
    };
    this.chatService.sendMsgToFirebase(mensaje, this.chat.id);
    this.msg = '';
    this.scrollToBottomOnInit();
  }

  scrollToBottomOnInit() {
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
   }, 100);

  }

}
