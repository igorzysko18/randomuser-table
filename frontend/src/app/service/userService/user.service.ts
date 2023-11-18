import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userService {
  private readonly apiUrl = 'http://localhost:3000/users';
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Accept': '*/*',
      'Authorization': localStorage.getItem('authToken') || ''
    })
  };
 
  constructor(private http: HttpClient) {}

  updateHeaders() {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Accept': '*/*',
        'Authorization': localStorage.getItem('authToken') || ''
      })
    };
  }

  getUserFromLogin(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user, this.headers);
  }

  importUsers(): Observable<any> {
    this.updateHeaders();
    return this.http.post<any>(`${this.apiUrl}/import`, {},this.headers);
  }

  createUser(user: any): Observable<any[]> {
    this.updateHeaders();
    return this.http.post<any[]>(this.apiUrl, user, this.headers);
  }

  editUser(user: any): Observable<any[]> {
    this.updateHeaders();
    return this.http.put<any[]>(`${this.apiUrl}/${user.id}`, user, this.headers);
  }

  getUsers(pageIndex?: number, pageSize?: number): Observable<any> {
    this.updateHeaders();
    if (pageIndex) pageIndex += 1;
    return this.http.get<any[]>(`${this.apiUrl}?page=${pageIndex || 1 }&pageSize=${pageSize || 10}`, this.headers);
  }

  getUserbyId(id: any): Observable<any[]> {
    this.updateHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${id}`, this.headers);
  }

  deleteUser(id: any): Observable<any> {
    this.updateHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.headers);
  }

  searchUsers(field: string, value: string): Observable<any> {
    this.updateHeaders();
    return this.http.get<any>(`${this.apiUrl}/search/${field}/${value}`, this.headers);
  }

}
