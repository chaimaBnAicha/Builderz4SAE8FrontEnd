import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem } from 'ngx-paypal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'template';





  public payPalConfig?: IPayPalConfig;
  purchaseItems = [
    { name: 'Waterproof Mobile Phone', quantity: 2, price: 450 },
    { name: 'Smartphone Dual Camera', quantity: 3, price: 240 },
    { name: 'Black Colour Smartphone', quantity: 1, price: 950 }
  ]
  
  private total: string = '0';


  constructor(public location: Location) {}

  ngOnInit(){
  }


  private initConfig(): void {
    const currency = 'USD'; // Add missing currency variable

    this.payPalConfig = {
      currency: currency,
      clientId: 'AZCV6I_QYws-IvxDftBwv8sghn4jT6lCkaE4HCO-0X0iMqr9EqJlyy-BZ4GAQ6xPyWjD_04YObOPvy7T',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.total,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.total
                }
              }
            },
            items: this.purchaseItems.map(x => <ITransactionItem>
              {
                name: x.name,
                quantity: x.quantity.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: currency,
                  value: x.price.toString(),
                },
              })
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }








  isMap(path: any){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
      return false;
    }
    else {
      return true;
    }
}
}
