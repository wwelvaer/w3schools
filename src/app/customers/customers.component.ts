import { Component, OnInit } from '@angular/core';
import { Customer } from '../classes';
import { DbConnectionService } from '../db-connection.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: Customer[];

  constructor(private db: DbConnectionService) {
   }

  async ngOnInit() {
    this.customers = await this.db.getCustomers();
  }

}
