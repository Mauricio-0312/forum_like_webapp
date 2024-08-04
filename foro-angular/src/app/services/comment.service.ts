import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
import {global} from "../global";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.url = global.url;
  }

  add(topicId, token, comment): Observable<any>{
    let params = JSON.stringify(comment);

    let headers = new HttpHeaders().set("Content-Type", "application/json")
                                    .set("authorization", token);

    return this._http.post(this.url+"comment/topic/"+topicId, params, {headers: headers});
  }


  delete(token, topicId, commentId): Observable<any>{

    let headers = new HttpHeaders().set("authorization", token);


    return this._http.delete(this.url+"comment/topic/"+commentId+"/"+topicId, {headers: headers});
  }
}
