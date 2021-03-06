import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { firestore } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { PayService } from 'src/app/services/pay.service';
import { PayVetService } from '../../services/pay-vet.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {

  @Input() empId;
  @Input() hUid;
  @Input() type;
  thisUserUid
  user;
  user2;
  rt;
  round;

  constructor(
    private modalCtrl: ModalController,
    public afs: AngularFireAuth,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private userService: UsersService,
    private payService: PayService,
    private payVetService: PayVetService,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getTodo((await this.afs.currentUser).uid).subscribe(res => {
      this.user = res;
      this.thisUserUid = this.user.uid;
      loading.dismiss();
    });

    this.userService.getTodo(this.empId).subscribe(res => {
      this.user2 = res;
      this.rt = this.user2.rate;
      this.round = Math.round(this.rt);
      console.log(this.round);
      loading.dismiss();
    });
  }

  rate(){
    return this.round;
  }

  close(){
    this.modalCtrl.dismiss();
  }

  async logRatingChange(rating){

    let sum = this.rt + rating;
    let avg = sum / 2;
  
    this.userService.Todos(this.empId).update({
      rate: avg,
    });
    
    if (this.type === 'Shop') {
      this.payService.Todos(this.hUid).update({
        rating: true,
      });
    } else if(this.type === 'Vet'){
      this.payVetService.Todos(this.hUid).update({
        rating: true,
      });
    }

    const alert2 = await this.alertController.create({
      message: 'Valoracion calificada.',
      buttons: ['OK']
    });
    await alert2.present();

    this.close();
  }

}
