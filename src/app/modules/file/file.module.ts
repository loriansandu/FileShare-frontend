import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileRoutingModule } from './file-routing.module';
import {FileComponent} from "./file/file.component";
import {ButtonModule} from "primeng/button";
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import {TooltipModule} from "primeng/tooltip";
import {SidebarModule} from "primeng/sidebar";
import { FilePanelComponent } from './file-panel/file-panel.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";


@NgModule({
  declarations: [
    FileComponent,
    ProgressCircleComponent,
    FilePanelComponent
  ],
  imports: [
    CommonModule,
    FileRoutingModule,
    ButtonModule,
    TooltipModule,
    SidebarModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
  ]
})
export class FileModule { }
