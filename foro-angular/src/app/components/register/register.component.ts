import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]

})
export class RegisterComponent implements OnInit {
  public user: User;
  public status: string;
  constructor(
    private _userService: UserService
  ) {
    this.user = new User("", "", "", "", "", "", "ROLE_USER");
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    console.log(this.user);
    this._userService.register(this.user).subscribe(
      response=>{
        console.log(response);
        if(response.status && response.status == "success"){
          this.status = "success";
        }else{
          this.status = "error";
        }
        console.log(this.status);
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    );
    
  }
}
