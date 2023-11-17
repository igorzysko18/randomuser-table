import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/listUsers/listUsers.component';
import { RouterModule, Routes } from '@angular/router';
import { TokenService } from './service/authenticationService/token.service';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'usuarios', component: UserListComponent, canActivate: [TokenService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }