import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'university-system';

  constructor(public authService: AuthService) { }

  // ฟังก์ชัน Logout โดยเรียกใช้ AuthService
  logout() {
    this.authService.logout();
  }
}