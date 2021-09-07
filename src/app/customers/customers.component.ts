import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from '../db-connection.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customerForm: FormGroup;
  id: number;
  loading: boolean;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private router: Router) {
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.id = -1;
      this.error = '';
      this.customerForm = new FormGroup({
        name: new FormControl(),
        contact: new FormControl(),
        address: new FormControl(),
        city: new FormControl(),
        postalCode: new FormControl(),
        country: new FormControl(),
      });
      if (params.id){
        this.db.getCustomer(params.id).then((d) => {
          if (d['error']){
            this.error = d['error'];
            this.loading = false;
            return;
          }
          if (d['data'] && d['data'][0]){
            let c = d['data'][0];
            this.customerForm.get('name').setValue(c['CustomerName']);
            this.customerForm.get('contact').setValue(c['ContactName']);
            this.customerForm.get('address').setValue(c['Address']);
            this.customerForm.get('city').setValue(c['City']);
            this.customerForm.get('postalCode').setValue(c['PostalCode']);
            this.customerForm.get('country').setValue(c['Country']);
            this.id = c['CustomerID'];
          } else
            this.error = `No customer with id '${params.id}' found`;
        })
      }
      this.loading = false;
    })
  }

  onSubmit(){
    let d = this.customerForm.getRawValue();
    if (this.id < 0)
      this.db.createCustomer(d['name'], d['contact'], d['address'], d['city'], d['postalCode'], d['country']).then(this.afterSubmit);
    else
      this.db.editCustomer(this.id, d['name'], d['contact'], d['address'], d['city'], d['postalCode'], d['country']).then(this.afterSubmit);
  }

  afterSubmit = (r) => {
    if (r['error']){
      this.error = r['error'];
      return;
    }
    if (r['data']['affectedRows'] === 1)
      this.toCustomerList();
    else
      this.error = "Something went wrong"
  }

  toCustomerList(){
    this.router.navigateByUrl('/dataset/customers')
  }

}
