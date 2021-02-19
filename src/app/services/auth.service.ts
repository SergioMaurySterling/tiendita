import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    private navCtrl: NavController,
    ) {}

  login(email: string, password: string) {

    return new Promise((resolve, rejected) => {
      this.AFauth.signInWithEmailAndPassword(email, password).then( user => {
        resolve(user);
      }).catch(err => rejected(err));
    });

  }

  async resetPassword(email: string): Promise<void>{
    try {
      return this.AFauth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  register(
    imageUrl: string,
    email: string,
    password: string,
    name: string,
    lastname: string,
    phone: string,
    googleDir: string,
    latitude: number,
    longitude: number,
    direction: string,
    rol: string,
    isPetData: boolean,
    isActive: boolean,
    date: string,
    ) {
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then( res => {
        // console.log(res.user.uid);
        const uid = res.user.uid;

        this.db.collection('users').doc(uid).set({
          imageUrl,
          name,
          lastname,
          phone,
          googleDir,
          latitude,
          longitude,
          direction,
          email,
          password,
          rol,
          isPetData,
          isActive,
          date,
          uid
        });
        resolve(res);
      }).catch(err => rejected(err));
    });
  }

  registerEmp(
    imageUrl: string,
    email: string,
    password: string,
    name: string,
    lastname: string,
    nit: string,
    phone: string,
    googleDir: string,
    latitude: number,
    longitude: number,
    direction: string,
    delivery: number,
    description: string,
    horario: string,
    website: string,
    rol: string,
    isActive: boolean,
    rate: number,
    date: string,
    ) {
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then( res => {
        // console.log(res.user.uid);
        const uid = res.user.uid;

        this.db.collection('users').doc(uid).set({
          imageUrl,
          email,
          password,
          name,
          lastname,
          nit,
          phone,
          googleDir,
          latitude,
          longitude,
          direction,
          delivery,
          description,
          horario,
          website,
          rol,
          isActive,
          rate,
          date,
          uid
        });
        resolve(res);
      }).catch(err => rejected(err));
    });
  }

  logOut() {
    this.AFauth.signOut().then( () => {
      this.navCtrl.navigateRoot('/login');
    });
  }
}
