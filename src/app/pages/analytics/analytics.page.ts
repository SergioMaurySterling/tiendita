import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ModalController } from '@ionic/angular';
import * as Chart from 'chart.js';
import { UsersService } from 'src/app/services/users.service';
import { PayService } from '../../services/pay.service';
import { PayVetService } from '../../services/pay-vet.service';
import { ProductService } from '../../services/product.service';
import { VetCareService } from '../../services/vetcare.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {

  private investmentChart: Chart;
  uid: string;
  user;
  rate;
  todos;
  todos2;
  payServiceTotal: number;
  payVetTotal: number;
  payServiceApproved: number;
  payServiceProcess: number;
  payServiceComplete: number;
  payServiceCancelado: number;
  payVetApproved: number;
  payVetProcess: number;
  payVetComplete: number;
  payVetCancelado: number;
  todosPay;
  productSum: any;
  payMoreVent;
  payVetMoreVent;
  payMoreVentName: any;
  payMoreVet;
  payMoreVetName: any;

  constructor(
    private ref: ChangeDetectorRef,
    public af: AngularFireAuth,
    private loadingController: LoadingController,
    private userService: UsersService,
    private payService: PayService,
    private productService: ProductService,
    private payVetService: PayVetService,
    private vetCareService: VetCareService,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.af.authState.subscribe( userL => {
      if (userL) {
        this.uid = userL.uid;
        this.userService.getTodo(this.uid).subscribe(res => {
          loading.dismiss();
          this.user = res;

          this.rate = this.user.rate;
          console.log('logeado');
        });

        this.payService.getTodoByEmpUid(this.uid).subscribe(res2 => {
          loading.dismiss();
          this.todos = res2;
          this.todosPay = res2;
          this.payServiceTotal = this.todos.length;

          if(this.todosPay.length){
            this.productSum = this.todosPay.reduce((sum, product) => sum + parseInt (product.total, 10), 0);
          } else {
            this.productSum = 0;
          }
        });

        this.productService.getTodoByUserUidOrderAmountVent(this.uid).subscribe(res2 => {
          loading.dismiss();
          this.payMoreVent = res2;
          this.payMoreVentName = this.payMoreVent[0].name;
        });

        this.vetCareService.getTodoByUserUidOrderAmountVent(this.uid).subscribe(res2 => {
          loading.dismiss();
          this.payMoreVet = res2;
          console.log(this.payMoreVet);
          this.payMoreVetName = this.payMoreVet[0].name;
        });

        this.payService.getTodoByEmpStatus(this.uid, 'APPROVED').subscribe(res2 => {
          loading.dismiss();
          this.todos = res2;
          this.payServiceApproved = this.todos.length;
        });

        this.payService.getTodoByEmpStatus(this.uid, 'PROCESS').subscribe(res2 => {
          loading.dismiss();
          this.todos = res2;
          this.payServiceProcess = this.todos.length;
        });

        this.payService.getTodoByEmpStatus(this.uid, 'COMPLETE').subscribe(res2 => {
          loading.dismiss();
          this.todos = res2;
          this.payServiceComplete = this.todos.length;
        });

        this.payService.getTodoByEmpStatus(this.uid, 'REJECTED').subscribe(res2 => {
          loading.dismiss();
          this.todos = res2;
          this.payServiceCancelado = this.todos.length;
        });


        this.payVetService.getTodoByEmpUid(this.uid).subscribe(res2 => {
          loading.dismiss();
          this.todos2 = res2;
          this.payVetTotal = this.todos2.length;
        });

        this.payVetService.getTodoByEmpStatus(this.uid, 'APPROVED').subscribe(res2 => {
          loading.dismiss();
          this.todos2 = res2;
          this.payVetApproved = this.todos2.length;
        });

        this.payVetService.getTodoByEmpStatus(this.uid, 'PROCESS').subscribe(res2 => {
          loading.dismiss();
          this.todos2 = res2;
          this.payVetProcess = this.todos2.length;
        });

        this.payVetService.getTodoByEmpStatus(this.uid, 'COMPLETE').subscribe(res2 => {
          loading.dismiss();
          this.todos2 = res2;
          this.payVetComplete = this.todos2.length;
        });

        this.payVetService.getTodoByEmpStatus(this.uid, 'REJECTED').subscribe(res2 => {
          loading.dismiss();
          this.todos2 = res2;
          this.payVetCancelado = this.todos2.length;

          this.generateCharts();
        });

      } else {
        loading.dismiss();
        console.log('not loging');
      }
    });

    this.ref.detectChanges();
  }

  serviceTotal(){
    const total = this.payServiceTotal + this.payVetTotal;
    return total;
  }

  serviceApproved(){
    const total = this.payServiceApproved + this.payVetApproved;
    return total;
  }

  serviceProcess(){
    const total = this.payServiceProcess + this.payVetProcess;
    return total;
  }

  serviceComplete(){
    const total = this.payServiceComplete + this.payVetComplete;
    return total;
  }

  serviceCancelado(){
    const total = this.payServiceCancelado + this.payVetCancelado;
    return total;
  }

  async generateCharts(){
    const ctx = document.getElementById('myChart');
    this.investmentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Nuevos servicios', 'Servicios en proceso', 'Servicios Completados', 'Servicios Cancelados'],
            datasets: [{
                data: [this.serviceApproved(), this.serviceProcess(), this.serviceComplete(), this.serviceCancelado()],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
        }
    });
  }

}
