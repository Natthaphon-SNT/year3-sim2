import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password_secure: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { username, password_secure }).pipe(
      tap((response: any) => {
        // เมื่อล็อกอินสำเร็จ ให้เก็บ Token และ Role ลง LocalStorage
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('role', response.role);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']); // เด้งกลับไปหน้าล็อกอิน
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}