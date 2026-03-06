import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  userProfile: any = null; // สร้างตัวแปรไว้เก็บข้อมูลจาก API
  isLoading: boolean = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // เรียกใช้ฟังก์ชันดึงโปรไฟล์เมื่อหน้าจอโหลด
    this.apiService.getMyProfile().subscribe({
      next: (data: any) => {
        this.userProfile = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', err);
        this.isLoading = false;
      }
    });
  }
}
