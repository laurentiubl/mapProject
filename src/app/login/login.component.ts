import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,  private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: success =>{
        if(success){
          this.loading = false;
          this.loginFailed = !success;
          this.router.navigate(['/', 'dashboard'])
        }else{
          this.loading = false;
          this.loginFailed = true;
        }
      },
      error: err => {
        this.loading = false;
        this.loginFailed = true;
      }
    });
  }
}
