import { Injectable } from '@angular/core';
import {Router, CanActivate} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard  implements CanActivate{
    constructor(
        private _router: Router,
        private _userService: UserService
    ){}

    canActivate(){
        let identity = this._userService.getIdentity();

        if(identity && identity.name){
            this._router.navigate(["/home"]);
            return false;
        }else{
            return true;
        }
    }
}