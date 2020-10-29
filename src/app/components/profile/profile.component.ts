import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { NotesService } from 'src/app/notes.service';
import jwt_decode  from "jwt-decode" ;
import { PluginsService } from 'src/app/plugins.service';

declare var $:any

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  token:string ;
  decodedToken:object = null ;

  existNotes:boolean = true ;
  message:string ;

  userNotes:any = null ;
  userNote:Object ;
  buttonIsClicked:boolean = false ;
  isloading:boolean = true ;

  addNoteForm:FormGroup = new FormGroup({
      title: new FormControl("",[Validators.required, Validators.minLength(1)]) ,
      desc: new FormControl("")
  });

  editNoteForm:FormGroup = new FormGroup({
      title: new FormControl("",[Validators.required, Validators.minLength(1)]) ,
      desc: new FormControl("")
  });

  deleteNoteForm:FormGroup = new FormGroup({});


  constructor( private _AuthenticationService:AuthenticationService ,
               private _NotesService:NotesService ,
               private _Router:Router ) {
      this.token = localStorage.getItem('TOKEN') ;
      if(this.tokenCheck()){ this.getUserNotes(); }
      else{ this._Router.navigate(['/signin']); }
  }


  tokenCheck():boolean{

    console.log(this.token);
    let flag:boolean = false ;

    if(this.token){

        try {
              this.decodedToken = jwt_decode(this.token) ;
              console.log(this.decodedToken);
              flag = true ;
        } catch (error) {
          localStorage.clear();
          flag = false ;
        }

    }else{ flag = false ; }

    return flag ;
  }


  getUserNotes(){

    let data =  { token: this.token ,
                  userID: this.decodedToken['_id']
                } ;

    console.log(data);
    this._NotesService.getUserNotes(data).subscribe(
                res => {
                         console.log(res);
                         if(res.message=="success"){
                           this.existNotes = true ;
                           this.userNotes = res.Notes ;
                         }else if(res.message == "no notes found"){
                                  this.existNotes = false ;
                                  this.message = "Your notes list is empty, let's add notes." ;
                                  this.userNotes = {} ;
                         }else if( res.message == "not authentication or error in token"){
                                  this.existNotes = false ;
                                  this.message = res.message ;
                                  this.userNotes = {} ;
                                  setTimeout(function(){ this._Router.navigate(['/signin']); } , 5000);
                                }
                          this.isloading = false ;
                       } ,
                err => {
                          console.log(err);
                          this.isloading = false ;
                          if(err.name=="HttpErrorResponse"){
                            console.log("Internet connection is lost:");
                            $('#toastoffline').toast('show');
                           }
                       }) ;

  }


  addNote()
  {
      this.buttonIsClicked = true ;
      this.token = localStorage.getItem('TOKEN') ;

      if(this.tokenCheck()){
            let data =  {
                          title: this.addNoteForm.value.title ,
                          desc: this.addNoteForm.value.desc ,
                          citizenID: this.decodedToken['_id'] ,
                          token: this.token
                        } ;

            console.log(data);
            this._NotesService.addUserNote(data).subscribe(
                        res => {
                                  console.log(res);
                                  if(res.message=="success"){
                                         this.isloading = true ;
                                         this.getUserNotes();
                                         this.buttonIsClicked = false ;
                                         $('#addNote').modal('hide');
                                         this.addNoteForm.reset();
                                        }
                                } ,
                        err => {
                                  console.log(err);
                                  this.buttonIsClicked = false ;
                                  $('#addNote').modal('hide');

                                  if(err.name=="HttpErrorResponse"){
                                    console.log("Internet connection is lost:");
                                    $('#toastoffline').toast('show');
                                  }
                               }) ;
      }else{
            this.buttonIsClicked = false ;
            $('#addNote').modal('hide');
            this.addNoteForm.reset();

            this.message = "not authentication or error in token" ;
            this.existNotes = false ;
            setTimeout( _ =>{ this._Router.navigate(['/signin']); } , 5000);
           }
  }



  preEditNote(element:object)
  {
      this.userNote = element ;
      this.editNoteForm.controls.title.setValue(element["title"]);
      this.editNoteForm.controls.desc.setValue(element["desc"]);
  }

  editNote()
  {
    this.buttonIsClicked = true ;
    this.token = localStorage.getItem('TOKEN') ;

    if(this.tokenCheck()){

      let data =  { title: this.editNoteForm.value['title'] ,
                    desc: this.editNoteForm.value['desc'] ,
                    NoteID: this.userNote["_id"] ,
                    token: this.token
                  }

      console.log(data);
      this._NotesService.editUserNote(data).subscribe(
                  res => {
                              console.log(res);
                              if(res.message=="updated"){
                                  this.isloading = true ;
                                  this.getUserNotes();
                                  this.buttonIsClicked = false ;
                                  $('#editNote').modal('hide');
                                  this.editNoteForm.reset();
                              }
                          } ,
                  err => {
                            console.log(err);
                            this.buttonIsClicked = false ;
                            $('#editNote').modal('hide');

                            if(err.name=="HttpErrorResponse"){
                              console.log("Internet connection is lost:");
                              $('#toastoffline').toast('show');
                            }
                          }) ;
    }else{
          this.message = "not authentication or error in token" ;
          this.existNotes = false ;
          setTimeout( _ =>{ this._Router.navigate(['/signin']); } , 5000);
          this.buttonIsClicked = false ;
          $('#editNote').modal('hide');
          this.editNoteForm.reset();
    }

  }



  preDeleteNote(element:object){
    this.userNote = element ;
  }

  deleteNote()
  {
    this.buttonIsClicked = true ;
    this.token = localStorage.getItem('TOKEN') ;

    if(this.tokenCheck()){

        let data =  {  NoteID: this.userNote["_id"] ,
                       token: this.token
                    } ;

        console.log(data);
        this.buttonIsClicked = true ;
        this._NotesService.deleteUserNote(data).subscribe(
                    res => {
                              console.log(res);
                              if(res.message=="deleted"){
                                  this.isloading = true ;
                                  this.getUserNotes();
                                  this.buttonIsClicked = false ;
                                  $('#deleteNote').modal('hide');
                              }
                            } ,
                     err => {
                              console.log(err);
                              this.buttonIsClicked = false ;
                              $('#deleteNote').modal('hide');

                              if(err.name=="HttpErrorResponse"){
                                console.log("Internet connection is lost:");
                                $('#toastoffline').toast('show');
                              }
                            }) ;

    }else{
          this.message = "not authentication or error in token" ;
          this.existNotes = false ;
          setTimeout( _ =>{ this._Router.navigate(['/signin']); } , 5000);
          this.buttonIsClicked = false ;
          $('#deleteNote').modal('hide');
    }

  }

  ngOnInit(): void { }

}
