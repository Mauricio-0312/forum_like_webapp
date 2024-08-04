import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {global} from "../../global";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: User[];
  public url: string;

  constructor(
    private _userService: UserService
  ) {
    this.url = global.url;

   }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        if(response.users){
          this.users = response.users;
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

}
