import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
import {global} from "../global";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  public url: string;
  public token: string;
  public identity;
  constructor(
    private _http: HttpClient
  ) { 
    this.url = global.url;
  }

  post(token, topic): Observable<any>{
    let params = JSON.stringify(topic);

    let headers = new HttpHeaders().set("Content-Type", "application/json")
                                    .set("authorization", token);

    return this._http.post(this.url+"saveTopic", params, {headers: headers});
  }

  getTopicsByUser(userId): Observable<any>{

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.get(this.url+"userTopics/"+userId, {headers: headers});
  }

  update(token, topicId, topic): Observable<any>{
    let params = JSON.stringify(topic);

    let headers = new HttpHeaders().set("Content-Type", "application/json")
                                    .set("authorization", token);


    return this._http.put(this.url+"updateTopic/"+topicId, params, {headers: headers});
  }

  getTopic(id): Observable<any>{

    return this._http.get(this.url+"topic/"+id);
  }

  delete(token, topicId): Observable<any>{

    let headers = new HttpHeaders().set("Content-Type", "application/json")
                                    .set("authorization", token);


    return this._http.delete(this.url+"deleteTopic/"+topicId, {headers: headers});
  }

  getTopics(page): Observable<any>{

    return this._http.get(this.url+"topics/"+page);
  }

  search(search): Observable<any>{
    return this._http.get(this.url+"search/"+search);
  }
}
