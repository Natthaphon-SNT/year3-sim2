import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ต้องใช้ FormsModule สำหรับ ngModel ผูกค่าเกรด
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-prof-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prof-grading.html',
  styleUrl: '../courses/courses.css' // ยืม CSS ตารางมาใช้
})
export class ProfGradingComponent implements OnInit {
  courses: any[] = []; // วิขาทั้งหมดที่อาจารย์สอน
  selectedCourseId: number | null = null;
  students: any[] = []; // นักศึกษาในวิชาที่เลือก

  isLoading: boolean = true;
  message: string = ''; // ข้อความแจ้งเตือนสีเขียว (บันทึกสำเร็จ)
  errorMessage: string = ''; // ข้อความแจ้งเตือนสีแดง (Error)

  // ตัวเลือกเกรดทั้งหมด
  gradeOptions = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'I'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // โหลดวิชาทั้งหมดที่อาจารย์คนนี้สอนมาเป็น Dropdown ให้เลือกก่อน
    this.apiService.getProfessorSchedule().subscribe({
      next: (data: any[]) => {
        // ใช้ Set เพื่อกรองวิชาที่ซ้ำกันออก (กรณี 1 วิชาสอนหลายวัน)
        const uniqueCourses = [];
        const map = new Map();
        for (const item of data) {
          if (!map.has(item.course_id)) {
            map.set(item.course_id, true);
            uniqueCourses.push({ id: item.course_id, code: item.course_code, title: item.title });
          }
        }
        this.courses = uniqueCourses;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'ไม่สามารถดึงข้อมูลวิชาที่สอนได้';
        this.isLoading = false;
      }
    });
  }

  // เมื่ออาจารย์เลือกวิชาจาก Dropdown
  onCourseSelect(event: any) {
    const courseId = event.target.value;
    if (!courseId) {
      this.students = [];
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.apiService.getStudentsInCourse(courseId).subscribe({
      next: (data: any[]) => {
        this.students = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'ไม่สามารถดึงรายชื่อนักศึกษาได้';
        this.isLoading = false;
      }
    });
  }

  // ฟังก์ชันบันทึกเกรด
  saveGrade(student: any) {
    if (!student.grade) return;

    this.apiService.updateGrade(student.enrollment_id, student.grade).subscribe({
      next: (res: any) => {
        this.message = `บันทึกเกรด ${student.grade} ให้กับ ${student.first_name} สำเร็จ!`;
        setTimeout(() => this.message = '', 3000); // ข้อความหายไปใน 3 วินาที
      },
      error: () => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการบันทึกเกรด';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}