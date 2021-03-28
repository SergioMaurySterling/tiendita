import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  directionForm: FormGroup;

  email: string;
  password: string;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private authservice: AuthService,
    public router: Router,
    public platform: Platform,
  ) {
    this.validatorsForms();
  }

  ngOnInit() {
  }

  validatorsForms() {
    if (this.platform.is('ios')) {
      this.directionForm = this.formBuilder.group({
        email: [''],
        password: ['']
      });
    } else{
      this.directionForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }

  onSubmitLogin() {
    this.authservice.login(this.email, this.password).then( res => {
      this.router.navigate(['/']);
    }).catch(async err => {
      console.log(err);
      const alert = await this.alertController.create({
        message: err,
        buttons: ['OK']
      });
      await alert.present();
    });
  }

}
