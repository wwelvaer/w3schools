import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetComponent } from './dataset/dataset.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dataset/Customers', pathMatch: 'full' },
  { path: 'dataset/:type', component: DatasetComponent },
  { path: 'form/:type', component: FormComponent},
  { path: '**', redirectTo: '/dataset/Customers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
