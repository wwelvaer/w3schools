import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { DatasetComponent } from './dataset/dataset.component';

const routes: Routes = [
  { path: '', redirectTo: '/dataset/customers', pathMatch: 'full' },
  { path: 'dataset', redirectTo: '/dataset/customers', pathMatch: 'full' },
  { path: 'dataset/:type', component: DatasetComponent },
  { path: 'customers', component: CustomersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
