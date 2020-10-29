import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {path:"" , redirectTo:"signin" , pathMatch:"full" } ,
  {path:"signin" , component: SignInComponent },
  {path:"signup" , component: SignUpComponent } ,
  {path:"profile" , canActivate:[AuthenticationGuard] , component: ProfileComponent },
  {path:"**" , component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
