import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrls: ['../courses/courses.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = true;
  message: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  toggleActiveStatus(user: any) {
    const newStatus = !user.is_active;
    const confirmMsg = newStatus ? `ต้องการเปิดใช้งาน ${user.username} ใช่หรือไม่?` : `ต้องการระงับการใช้งาน ${user.username} ใช่หรือไม่?`;
    
    if(confirm(confirmMsg)) {
      this.apiService.updateUserStatus(user.user_id, { email: user.email, is_active: newStatus }).subscribe({
        next: () => {
          this.message = 'อัปเดตสถานะสำเร็จ';
          this.loadUsers(); // รีโหลดข้อมูลใหม่
          setTimeout(() => this.message = '', 3000);
        },
        error: () => alert('เกิดข้อผิดพลาดในการอัปเดต')
      });
    }
  }
}