import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-prof-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prof-schedule.html',
  styleUrl: '../courses/courses.css' // ขอยืม CSS ของหน้า Courses มาใช้เพื่อให้ตารางหน้าตาเหมือนกัน
})
export class ProfScheduleComponent implements OnInit {
  schedule: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getProfessorSchedule().subscribe({
      next: (data: any) => {
        this.schedule = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถดึงข้อมูลตารางสอนได้';
        this.isLoading = false;
      }
    });
  }
}