import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserGuard} from "../services/userGuard"

import { AddComponent } from './components/add/add.component';
import { MainComponent } from './components/main/main.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';

const panelRoutes: Routes = [
    {
        path: "panel", 
        component: MainComponent,
        canActivate: [UserGuard],
        children: [
            {path: "", component: ListComponent},
            {path: "list", component: ListComponent},
            {path: "add", component: AddComponent},
            {path: "edit/:id", component: EditComponent}
        ]
    }
  

];

@NgModule({
  imports: [RouterModule.forChild(panelRoutes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }