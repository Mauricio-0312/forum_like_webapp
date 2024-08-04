import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PanelRoutingModule } from './panel-routing-module';
import { MomentModule } from 'angular2-moment';

import { AddComponent } from './components/add/add.component';
import { MainComponent } from './components/main/main.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';


@NgModule({
  declarations: [
    AddComponent,
    MainComponent,
    ListComponent,
    EditComponent
  ],
  imports: [
    PanelRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MomentModule
  ],
  exports: [
    AddComponent,
    MainComponent,
    ListComponent,
    EditComponent
  ],
  providers: [],
})
export class PanelModule { }