import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TopicService} from "../../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Topic} from "../../../models/topic";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [UserService]
})
export class ListComponent implements OnInit {

  public topics: Array<Topic>;
  public status: string;
  public token: string;
  public identity;

  constructor(
    private _userService: UserService,
    private _topicService: TopicService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();

   }
  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(){
    let userId = this.identity._id;
    this._topicService.getTopicsByUser(userId).subscribe(
      response=>{
        if(response.topics && response.topics.length > 0){
          this.topics = response.topics;
          this.status = "success";
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

  delete(id){
    this._topicService.delete(this.token, id).subscribe(
      response=>{
        this.getTopics();
      },
      error=>{
        console.log(error);
      }
    )
  }

}
