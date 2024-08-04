import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Topic} from "../../models/topic";
import {Comment} from "../../models/comment";
import {TopicService} from "../../services/topic.service";
import {CommentService} from "../../services/comment.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {global} from "../../global";
@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css'],
  providers: [TopicService]
})
export class TopicDetailComponent implements OnInit {

  public topic: Topic;
  public comment: Comment;
  public identity;
  public token: string;
  public comment_status;
  public url: string;

  constructor(
    private _topicService: TopicService,
    private _userService: UserService,
    private _commentService: CommentService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    if(this.identity != null){
      this.comment = new Comment("","","", this.identity._id);

    }
  }
  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(
      params=>{
        var id = params.id;
        this._topicService.getTopic(id).subscribe(
          response=>{
            if(response.topic){
              this.topic = response.topic;
              console.log(this.topic);

            }else{
              this._router.navigate(["/home"]);
            }
          },
          error=>{
            console.log(error);
          }
        );
      }
    );
  }

  onSubmit(form){
    this._commentService.add(this.topic._id, this.token, this.comment).subscribe(
      response=>{
        if(response.topic){
          this.topic = response.topic;
          this.comment_status = "success";
          form.reset();
        }else{
          this.comment_status = "error";
        }
      },
      error=>{
          this.comment_status = "error";
          console.log(error);
      }
    );
  }

  deleteComment(commentId){
    this._commentService.delete(this.token, this.topic._id, commentId).subscribe(
      response=>{
        if(response.topic){
          this.getTopic();
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

}
