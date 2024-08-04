import { Component, OnInit } from '@angular/core';
import {Topic} from "../../models/topic";
import {TopicService} from "../../services/topic.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['./search.component.css'],
  providers: [TopicService]
})
export class SearchComponent implements OnInit {

  public topics: Topic[];
  public search;
  public search_param;
  constructor(
    private _topicService: TopicService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.search = true;
  }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(){
    this._route.params.subscribe(
      params=>{
        this.search_param = params.search;
        this._topicService.search(this.search_param).subscribe(
          response=>{
            if(response.topics){
              this.topics = response.topics;
            }
          },
          error=>{
            console.log(error);
          }
        )
      }
    )
  }
}
