import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Topic} from "../../models/topic";
import {TopicService} from "../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  providers: [TopicService]
})
export class TopicsComponent implements OnInit {
  public topics: Topic[];
  public total_pages: number;
  public prev_page: number;
  public next_page: number;
  public array_pages: Array<any>;
  public search;
  constructor(
    private _topicService: TopicService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.search = false;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        if(params.page){
          var page = params.page;
        }else{
          page = 1;
        }

        this.getTopics(page);
      }
    );
    console.log(this.array_pages)
  }

  getTopics(page){
    this._topicService.getTopics(page).subscribe(
      response=>{
        if(response.topics && response.topics.length > 0){
          this.topics = response.topics;
          this.total_pages = response.totalPages;
          
          var array_pages = []
          for(let i = 1; i <= this.total_pages; i++){
            array_pages.push(i);
          }

          this.array_pages = array_pages;
          
          if((page-1) > 0){
            this.prev_page = page -1;
          }else{
            this.prev_page = 1;
          }

          if((page+1) < this.total_pages){
            this.next_page = page +1;
          }else{
            this.next_page = this.total_pages;
          }
        }else{
          this._router.navigate(["/home"]);
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

}
