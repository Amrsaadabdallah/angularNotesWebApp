import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms' ;
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';
declare var $:any ;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    resMessage:string = "success" ;
    buttonIsClicked:boolean = false ;

      signUpForm:FormGroup =  new FormGroup({
          first_name: new FormControl('',[Validators.required,Validators.pattern(/^([a-zA-Z]+[,.]?[ ]?|[a-z]+['-]?)+$/)]) ,
          last_name: new FormControl('',[Validators.required,Validators.pattern(/^([a-zA-Z]+[,.]?[ ]?|[a-z]+['-]?)+$/)]) ,
          email: new FormControl('',[Validators.required,Validators.email]) ,
          password: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]) ,
          age: new FormControl('',[Validators.required,Validators.max(100)])
      }) ;

    constructor( private _AuthenticationService:AuthenticationService ,
                 private _Router:Router) { }

    signUpFormSubmit(){

        if(this.signUpForm.valid){
            this.buttonIsClicked = true ;
            console.log(this.signUpForm);

            this._AuthenticationService.signUpApi(this.signUpForm.value).subscribe(
                res => {
                        console.log(res) ;
                        this.buttonIsClicked = false ;
                        this.resMessage = res.message ;

                        if(res.message == "success"){
                          $('#toastsignUp').toast('show');
                          setTimeout(
                                      ()=>{
                                            this.signUpForm.reset();
                                            this._Router.navigate(['/signin']);
                                          }
                                      , 4000);

                        }else{
                          this.resMessage = res.errors.email.message ;
                        }
                } ,
                err => {
                        console.log(err) ;
                        this.buttonIsClicked = false ;
                        if(err.name=="HttpErrorResponse"){
                            console.log("Internet connection is lost:");
                            $('#toastoffline').toast('show');
                        }
                }
            );
        }

    }

  ngOnInit(): void { }

}
