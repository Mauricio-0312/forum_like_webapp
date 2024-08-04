import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TopicService} from "../../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Topic} from "../../../models/topic";

@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

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
    this.is_edit = true;
   }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(params=>{
      let id = params.id;
      this._topicService.getTopic(id).subscribe(
        response=>{
          if(response.topic){
            this.topic = response.topic;
          }else{
            this._router.navigate(['/panel']);
          }
        },
        error=>{
          console.log(error);
        }
      )

    })
  }

  onSubmit(form){
    this._topicService.update(this.token, this.topic._id, this.topic).subscribe(
      response=>{
        if(response.topic_updated){
          this.status = "success";
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
