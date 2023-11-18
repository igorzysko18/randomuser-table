import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { userService } from '../../service/userService/user.service';
import moment from 'moment';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  user: any = {};
  originalUser: any = {};
  public mode: string =  '';
  public nameMode: string = '';
  public showPassword: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    private userService: userService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    
  ) {
    this.mode = data.mode;
    this.nameMode = this.mode == 'edit' ? 'Editar usuário' : 'Adicionar usuário';
    if (this.mode == 'edit') {
      this.getUserbyId(data.user);
    } else {
      this.user = { username: '', email: '', birthday: '', phone_number: '', picture: '', name: '' };
    }
  }

  getUserbyId(user: any): void {
    this.userService.getUserbyId(user.id).subscribe( 
      (data: any[]) => {
        this.user = data;
        this.user.birthday = moment(this.user.birthday).format('DD/MM/YYYY');
        this.originalUser = JSON.parse(JSON.stringify(this.user));
      },
      (error: any[]) => {
        console.error(error);
      }
    )
  }

  onSubmit(): void {
    if (this.mode == 'edit') {
      if (JSON.stringify(this.user) === JSON.stringify(this.originalUser)) {
        this.dialogRef.close(this.user);
      } else {
        this.user.birthday = moment(this.user.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
        this.userService.editUser(this.user).subscribe(
          (data: any[]) => {
            this.dialogRef.close(this.user);
          },
          (error: any[]) => {
            console.error(error);
          }
        )
      }
    } else {
      this.user.birthday = moment(this.user.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
      this.userService.createUser(this.user).subscribe(
        (data: any[]) => {
          this.dialogRef.close(this.user);
        },
        (error: any[]) => {
          console.error(error);
        }
      )
    }
  }

  togglePasswordVisibility () {
    this.showPassword = !this.showPassword;
  }

  formatDate(value: string) {
    let res = value.replace(/\D/g, "");
    if (res.length > 2) {
      res = res.slice(0, 2) + '/' + res.slice(2);
    }
    if (res.length > 5) {
      res = res.slice(0, 5) + '/' + res.slice(5);
    }
    if (res.length > 10) {
      res = res.slice(0, 10);
    }
    this.user.birthday = res;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
