import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
import {global} from "../global";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public token: string;
  public identity;
  constructor(
    private _http: HttpClient
  ) { 
    this.url = global.url;
  }

  register(user): Observable<any>{
    let params = JSON.stringify(user);

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(this.url+"register", params, {headers: headers});
  }

  login(user, getToken = null): Observable<any>{
    if(getToken){
      user.getToken = getToken;
    }
    let params = JSON.stringify(user);

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(this.url+"login", params, {headers: headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem("identity"));

    if(identity && identity != null && identity != undefined && identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return identity;
  }

  getToken(){
    let token = localStorage.getItem("token");

    if(token && token != null && token != undefined && token != "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }

    return token;
  }

  update(user): Observable<any>{
   
    let params = JSON.stringify(user);

    let headers = new HttpHeaders().set("Content-Type", "application/json")
                                    .set("authorization", this.getToken());

    return this._http.put(this.url+"user/update", params, {headers: headers});
  }

  getUsers(): Observable<any>{
    return this._http.get(this.url+"users");
  }

  getUser(id): Observable<any>{
    return this._http.get(this.url+"user/"+id);
  }
}
