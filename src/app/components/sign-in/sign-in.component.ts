import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';

declare var $:any

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  resMessage:string = "" ;
  buttonIsClicked:boolean = false ;

  signInForm:FormGroup = new FormGroup({
    email: new FormControl("",[Validators.required , Validators.email]),
    password: new FormControl('',[Validators.required , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])
  });


  constructor(  private _AuthenticationService:AuthenticationService ,
               private _Router:Router) {
      if(localStorage.getItem('TOKEN')){ this._Router.navigate(['/profile']); }
      else{localStorage.clear();}
  }


  signInFormSubmit(){
      if(this.signInForm.valid){

          console.log(this.signInForm) ;
          this.buttonIsClicked = true ;

          this._AuthenticationService.signInApi(this.signInForm.value).subscribe(
                res => {
                          console.log(res) ;
                          this.buttonIsClicked = false ;
                          this.resMessage = res.message ;
                          if(res.message == "success"){
                            localStorage.setItem("TOKEN",res.token);
                            this.signInForm.reset();
                            this._Router.navigate(['/profile']);
                          }
                        } ,
                err => {
                         console.log(err) ;
                         this.buttonIsClicked = false ;
                         if(err.name=="HttpErrorResponse"){
                            console.log("Internet connection is lost:");
                            $('#toastoffline').toast('show');
                         }
                }   );
      }
  }


  ngOnInit(): void { }

}
