import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // อนุญาตให้เข้าได้
    } else {
      this.router.navigate(['/login']); // ไม่อนุญาต ให้เด้งไปหน้า login
      return false;
    }
  }
}