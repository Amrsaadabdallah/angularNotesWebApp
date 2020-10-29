import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  domainURL:String = "https://routeegypt.herokuapp.com/" ;

  constructor( private _HttpClient:HttpClient ,  private _Router:Router) { }

  signUpApi(data):Observable<any>{
      return  this._HttpClient.post(this.domainURL+"signup",data);
  }

  signInApi(data):Observable<any>{
      return  this._HttpClient.post(this.domainURL+"signin",data);
  }

  signOutApi(data):Observable<any>{
      return  this._HttpClient.post(this.domainURL+"signOut",data);
  }

  islogin():boolean{
      return !!localStorage.getItem('TOKEN') ;
  }

  logOut(){
      localStorage.removeItem('TOKEN');
      this._Router.navigate(['/signin']);
  }

}
