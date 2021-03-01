import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {

  directionForm: FormGroup;
  user;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private loadingController: LoadingController,
  ) {
    this.validatorsForms();
  }

  ngOnInit() {
  }

  validatorsForms() {
    this.directionForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  async onResetPassword(email){

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.userService.getUsersByEmail(email.value).subscribe(async res => {
      loading.dismiss();
      this.user = res;
      
      if (this.user.length){
        try {
          await this.authService.resetPassword(email.value);
    
          const alert = await this.alertController.create({
            message: 'Se envió la recuperación de contraseña a su correo.',
            buttons: ['OK']
          });
          await alert.present();
    
          this.router.navigate(['/login']);
        } catch (error) {
          console.log(error);
        }
      } else{
        const alert = await this.alertController.create({
          message: 'El usuario no existe.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}
