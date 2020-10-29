import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {

  domainURL:String = "https://routeegypt.herokuapp.com/" ;

  constructor(private _HttpClient:HttpClient) { }

  getUserNotes(data):Observable<any>{
     return  this._HttpClient.post(`${this.domainURL}getUserNotes`,data) ;
  }

  addUserNote(data):Observable<any>{
     return  this._HttpClient.post(`${this.domainURL}addNote`,data) ;
  }

  editUserNote(data):Observable<any>{
    return  this._HttpClient.put(`${this.domainURL}updateNote`,data) ;
  }

  deleteUserNote(data):Observable<any>{
    let options ={
                    headers:new HttpHeaders({}),
                    body: { NoteID: data.NoteID ,  token:  data.token }
                 }
    return  this._HttpClient.delete(`${this.domainURL}deleteNote`,options) ;
  }

}
