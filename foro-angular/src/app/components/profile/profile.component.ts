import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Topic} from "../../models/topic";
import {User} from "../../models/user";
import {TopicService} from "../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {global} from "../../global";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, TopicService]
})
export class ProfileComponent implements OnInit {
  public user: User;
  public topics: Topic[];
  public url: string;
  constructor(
    private _topicService: TopicService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = global.url
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        var userId = params.userId;
        this.getUser(userId);
        this.getTopics(userId);
      }
    );
  }

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response=>{
        if(response.user){
          this.user = response.user;
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

  getTopics(userId){
    this._topicService.getTopicsByUser(userId).subscribe(
      response=>{
        if(response.topics){
          this.topics = response.topics;
        }
      },
      error=>{
        console.log(error);
      }
    );
  }
}
