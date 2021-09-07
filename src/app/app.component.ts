import { Component } from '@angular/core';
import { dataset, Ref } from './classes';
import { DbConnectionService } from './db-connection.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'w3schools';

  datasets = Object.entries(dataset);

  constructor(){
  }
}
