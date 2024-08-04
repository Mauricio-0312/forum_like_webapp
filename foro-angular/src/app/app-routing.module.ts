import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserGuard} from "./services/userGuard";
import {NoUserGuard} from "./services/noUserGuard";

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent, canActivate: [NoUserGuard]},
  {path: "register", component: RegisterComponent, canActivate: [NoUserGuard]},
  {path: "user/update", component: UserEditComponent, canActivate: [UserGuard]},
  {path: "topics", component: TopicsComponent},
  {path: "topics/:page", component: TopicsComponent},
  {path: "topic/:id", component: TopicDetailComponent},
  {path: "users", component: UsersComponent},
  {path: "profile/:userId", component: ProfileComponent},
  {path: "search/:search", component: SearchComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
