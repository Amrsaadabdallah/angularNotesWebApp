import { Component } from '@angular/core';
//import { PluginsService } from './plugins.service';

declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'notes-app';

  constructor(){
    // $("body").niceScroll({
    //   cursorcolor:"#0075FF" ,
    //   cursorwidth: "10px" ,
    //   background:"rgba(20,20,20,0.3)",
    //   cursorborder: 0 ,
    //   // cursorborderradius: 0 ,
    //   authohidemode:true,
    //   horizrailenabled:false
    // });
  }

}
