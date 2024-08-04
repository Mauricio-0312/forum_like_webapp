import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  public status: string;
  public token: string;
  public identity;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.user = new User("", "", "", "", "", "", "");
   }

  ngOnInit(): void {
  }

  onSubmit(form){

    
    this._userService.login(this.user).subscribe(
      response=>{
        //Get user
        if(response.status && response.status == "success"){
          this.identity = response.user;

          //Save identity on localStorage
          localStorage.setItem("identity", JSON.stringify(this.identity));

          //get token
          this._userService.login(this.user, true).subscribe(
            response=>{
              if(response.token){
                this.status = "success";
                this.token = response.token;
                
                //Save token on localStorage
                localStorage.setItem("token", this.token);

                //Redirect to homepage
                this._router.navigate(['/home']);
      
              }else{
                this.status = "error";
              }
            },
            error=>{
              this.status = "error";
              console.log(error);
            }
          );

        }else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    );
  }

}
