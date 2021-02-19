import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {

  directionForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
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
    try {
      await this.authService.resetPassword(email.value);

      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Se envió la recuperación de contraseña a su correo.',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }

}
