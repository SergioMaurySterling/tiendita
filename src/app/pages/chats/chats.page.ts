import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatsService } from 'src/app/services/chats.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  public chatRooms: any = [];
  public chatRooms2: any = [];
  public chatRooms3: any = [];

  selectTabs = 'creadas';

  constructor(
    public chatservice: ChatsService,
    private loadingController: LoadingController,
    private modal: ModalController,
    private modal2: ModalController,
    private modal3: ModalController,
    public af: AngularFireAuth,
    private userService: UsersService,
  ) { }

  user = null;
  public name;
  public lastname;
  public rol;
  thisUid;

  textoBuscar = '';

  async ngOnInit() {

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.af.currentUser).uid).subscribe(res => {
      this.user = res;

      this.name = this.user.name;
      this.lastname = this.user.lastname;
      this.rol = this.user.rol;
      this.thisUid = this.user.uid;
      loading.dismiss();
    });

    this.chatservice.getTodosDesc().subscribe( chats => {
      loading.dismiss();
      this.chatRooms = chats;
    });

    this.chatservice.getUsersByEmisorDesc((await this.af.currentUser).uid).subscribe( chats => {
      loading.dismiss();
      this.chatRooms2 = chats;
    });

    this.chatservice.getUsersByReceptorDesc((await this.af.currentUser).uid).subscribe( chats => {
      loading.dismiss();
      this.chatRooms3 = chats;
    });
  }

  // tslint:disable-next-line: no-shadowed-variable
  openChat(chat) {
    this.modal2.create({
      component: ChatComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        chat
      }
    }).then( (modal2) => modal2.present());
  }

  closeChat() {
    this.modal.dismiss();
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

}
