import { Component } from '@angular/core';
import { Ref } from './classes';
import { DbConnectionService } from './db-connection.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'w3schools';

  tabs: Ref[] = [{
    name: 'Customers',
    url: ''
  },{
    name: 'Orders',
    url: ''
  },{
    name: 'Products',
    url: ''
  },{
    name: 'Order details',
    url: ''
  },]

  constructor(private dbConnectionService: DbConnectionService){
  }
}
