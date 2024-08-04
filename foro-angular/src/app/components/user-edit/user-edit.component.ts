import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {global} from "../../global";
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public user: User;
  public status: string;
  public token: string;
  public identity;
  public afuConfig;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = global.url;

    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.png,.jpeg,.gif",
      maxSize: "50",
      uploadAPI:  {
        url: this.url+"upload-avatar",
        method:"POST",
        headers: {
       "authorization" : this.token
        }
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      fileNameIndex: true,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Attach Files...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }
  };
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.update(this.user).subscribe(
      response=>{
        if(response.status && response.status == "success"){
          this.status = "success";
          console.log(response);
          
          localStorage.setItem("identity", JSON.stringify(this.user));
        }else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    )
  }

  uploadAvatar(data){
    this.user.image = data.body.user.image;
    console.log(this.user);
  }

}
