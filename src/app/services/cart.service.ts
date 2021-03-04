import { Component, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  delprice: number;
  category: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  static data: Product[] = [
    { id: 0, name: 'Comida de perros', price: 24100, delprice: 28400, category: 'Alimento', amount: 1 },
    { id: 1, name: 'Comida de Gatos', price: 22000, delprice: 23200, category: 'Alimento', amount: 1 },
    { id: 2, name: 'Collar Cuero Grande', price: 35900, delprice: 36000, category: 'Complementos', amount: 1 },
    { id: 3, name: 'Hueso de juguete', price: 25300, delprice: 29500, category: 'Juguetes', amount: 1 },
  ];

  static cart = [];
  static cartItemCount = new BehaviorSubject(0);

  constructor() { }

  static getProducts() {
    return this.data;
  }

  static getCart(){
    return this.cart;
  }

  static getCartItemCount(){
    return this.cartItemCount;
  }

  static addProduct(product){
    let added = false;
    for (const p of this.cart) {
      if (p.uid === product.uid) {
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
    console.log(this.cart);
    // console.log(this.cartItemCount);
  }

  static decreaseProduct(product){
    for (const [index, p] of this.cart.entries()) {
      if (p.uid === product.uid) {
        p.amount -= 1;
        if (p.amount === 0) {
          this.cart.splice(index, 1);
          p.amount = 1;
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  static removeProduct(product){
    for (const [index, p] of this.cart.entries()) {
      if (p.uid === product.uid) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
        p.amount = 1;
      }
    }
  }

  static delCart(){
    return this.cart = [];
  }
  static delItemCount(){
    return this.cartItemCount = new BehaviorSubject(0);
  }
}
