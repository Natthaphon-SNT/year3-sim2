import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'ไม่สามารถดึงข้อมูลรายวิชาได้ (กรุณาตรวจสอบว่าล็อกอินแล้วหรือ Backend ทำงานอยู่)';
        this.isLoading = false;
      }
    });
  }
}