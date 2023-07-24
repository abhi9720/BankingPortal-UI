import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  
  constructor(private authservice : AuthService){  }


  isLoggedIn(){
    return this.authservice.isLoggedIn();
  }

  logout(): void {
    this.authservice.logOutUser();
  }
}
