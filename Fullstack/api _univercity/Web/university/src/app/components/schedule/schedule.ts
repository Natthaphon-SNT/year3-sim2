import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css'
})
export class ScheduleComponent implements OnInit {
  classSchedule: any[] = [];
  examSchedule: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // โหลดตารางเรียน
    this.apiService.getStudentSchedule().subscribe({
      next: (data) => {
        this.classSchedule = data;
        this.checkIfDone();
      },
      error: () => this.handleError()
    });

    // โหลดตารางสอบ
    this.apiService.getStudentExams().subscribe({
      next: (data) => {
        this.examSchedule = data;
        this.checkIfDone();
      },
      error: () => this.handleError()
    });
  }

  // เนื่องจากมี 2 API เลยต้องเช็กว่าโหลดเสร็จครบหรือยัง
  private loadCount = 0;
  private checkIfDone() {
    this.loadCount++;
    if (this.loadCount === 2) {
      this.isLoading = false;
    }
  }

  private handleError() {
    this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางเรียน/สอบ';
    this.isLoading = false;
  }
}