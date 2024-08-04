import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TopicService} from "../../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Topic} from "../../../models/topic";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [UserService]
})
export class AddComponent implements OnInit {

  public topic: Topic;
  public status: string;
  public token: string;
  public identity;
  public is_edit: boolean; 
  constructor(
    private _userService: UserService,
    private _topicService: TopicService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.is_edit = false;
    this.topic = new Topic("", "", "", "", "", "", this.identity._id, "");
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._topicService.post(this.token, this.topic).subscribe(
      response=>{
        if(response.topic){
          this.status = "success";
          this._router.navigate(["/panel"]);
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

}
