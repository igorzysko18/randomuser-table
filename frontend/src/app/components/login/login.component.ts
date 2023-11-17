import { Component, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { userService } from '../../service/userService/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  public userLogin: string =  "";
  public userPassword: string = "";
  public hasToWait: boolean = false;
  public showPassword: Boolean = false;
  public keepUserConnected: Boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: userService,
  ) { }

  ngOnInit () {
  }

  doLogin () {
    this.hasToWait = true;
    try {
      if (this.userLogin && this.userPassword) {
        this.userService.getUserFromLogin({ username: this.userLogin, password: this.userPassword})
          .subscribe(
            (response: any) => {
              localStorage.setItem('authToken', response.token);
              this.hasToWait = false;
              this.showNotification('Login efetuado com êxito', '');
              this.router.navigate(['usuarios']);
            },
            (error: any) => {
              this.showNotification('Não foi possível efetuar o login. Tente novamente mais tarde.', 'Ok', 3000);
              this.hasToWait = false;
            }
          )
      }
      else {
        this.hasToWait = false;
        this.showNotification('Preencha os campos login e senha e tente novamente', '');
      }
    }
    catch (error) {
      this.hasToWait = false; 
    }
  }

  togglePasswordVisibility () {
    this.showPassword = !this.showPassword;
  }

  showNotification (message: string, action: string, duration = 2000) {
    this.snackBar.open(message, action, { duration: duration })
  }
}