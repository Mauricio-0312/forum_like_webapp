
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MomentModule } from 'angular2-moment';
import { NgxHighlightJsModule } from '@nowzoo/ngx-highlight-js';

//Servicios
import {UserGuard} from "./services/userGuard";
import {NoUserGuard} from "./services/noUserGuard";
import {UserService} from "./services/user.service";

import { PanelModule } from './panel/panel-module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    UserEditComponent,
    TopicsComponent,
    TopicDetailComponent,
    UsersComponent,
    ProfileComponent,
    SearchComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFileUploaderModule,
    FormsModule,
    HttpClientModule,
    PanelModule,
    MomentModule,
    NgxHighlightJsModule.forRoot()
  ],
  providers: [
    UserService,
    UserGuard,
    NoUserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
