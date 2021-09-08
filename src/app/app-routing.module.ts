import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetComponent } from './dataset/dataset.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dataset/customers', pathMatch: 'full' },
  { path: 'dataset', redirectTo: '/dataset/customers', pathMatch: 'full' },
  { path: 'dataset/:type', component: DatasetComponent },
  { path: 'form/:type', component: FormComponent },
  { path: 'form/:type/:id', component: FormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
