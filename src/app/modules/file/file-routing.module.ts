import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FileComponent} from "./file/file.component";

const routes: Routes = [
  {
    path: '',
    component: FileComponent,
  },
  {
    path: 'downloads/:param',
    component: FileComponent,
  },
  {
    path: '**',
    redirectTo: '', // Redirect to the main path for any other route
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
