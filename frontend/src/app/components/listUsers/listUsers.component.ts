import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { UserModalComponent } from '../user-modal/user-modal.component';
import { userService } from '../../service/userService/user.service';


@Component({
  selector: 'app-listUsers',
  templateUrl: './listUsers.component.html',
  styleUrls: ['./listUsers.component.scss'],
})
export class UserListComponent implements OnInit {
  public users: any[] = [];
  public importing: boolean = false;
  public length = 0;
  public selectedField: string = '';
  public searchText: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor( 
    private userService: userService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(pageIndex?: number, pageSize?: number): void {
    this.userService.getUsers(pageIndex, pageSize).subscribe(
      (data: any) => {
        this.length = data?.totalAllUsers || 0;
        this.users = data?.users || []
      },
      (error: any[]) => {
        this.showNotification('Não foi possível obter a lista de usuários.', '');
      }
    );
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
        this.showNotification('Usuário atualizado.', '');
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
        this.showNotification('Usuário adicionado com sucesso.', '');
      }
    });
  }

  onPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
  
    // Atualize sua chamada de API com pageIndex e pageSize
    this.getUsers(pageIndex, pageSize);
  }
  
  
  deleteUser(user: any): void {
    this.userService.deleteUser(user.id).subscribe(
      (data: any[]) => {
        this.showNotification('Usuário deletado.', '');
        this.getUsers();
      },
      (error: any[]) => {
        console.error(error);
      }
    )
  }

  importUsers(): void {
    this.importing = true;
    this.userService.importUsers().subscribe(
      (data: any[]) => {
        setTimeout(() => {
          this.importing = false;
        }, 3000);
        this.showNotification('Usuários importados com sucesso.', '');
        this.getUsers();
      },
      (error: any[]) => {
        this.importing = false;   
        console.error('Error fetching users:', error);
      }
    )
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  search(): void {
    if (!this.selectedField || !this.searchText) {
      this.showNotification('Selecione um campo e insira um texto para buscar.', '');
      return;
    }

    this.userService.searchUsers(this.selectedField, this.searchText).subscribe(
      (data: any[]) => {
        this.users = data;
        this.showNotification('Busca realizada com sucesso.', '');
      },
      (error: any) => {
        console.error(error);
        this.showNotification('Erro ao buscar os usuários.', '');
      }
    );
  }

  showNotification (message: string, action: string, duration = 2000) {
    this.snackBar.open(message, action, { duration: duration })
  }
}