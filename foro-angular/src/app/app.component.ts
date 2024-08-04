import { Component, DoCheck } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {global} from "./global";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements DoCheck{
  title = 'foro-angular';
  public token: string;
  public url: string;
  public identity;
  public search;
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
   }

   ngDoCheck(){
    this.identity = this._userService.getIdentity();

   }

   logout(){
     localStorage.clear();
     this.token = null;
     this.identity = null;
    this._router.navigate(["/home"]);
   }

   goSearch(){
     this._router.navigate(["/search", this.search]);
   }
}
