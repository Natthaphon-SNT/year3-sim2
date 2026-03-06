import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades.html',
  styleUrl: './grades.css'
})
export class GradesComponent implements OnInit {
  grades: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getStudentGrades().subscribe({
      next: (data) => {
        this.grades = data;
    this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'ไม่สามารถดึงข้อมูลผลการศึกษาได้';
        this.isLoading = false;
      }
    });
  }
}