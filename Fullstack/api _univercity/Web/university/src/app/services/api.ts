import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // ฟังก์ชันดึง Token จาก LocalStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // เรียกข้อมูลวิชาเรียน
  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/courses`, { headers: this.getHeaders() });
  }

  // เรียกข้อมูลประวัติการยืมหนังสือ
  getLibraryHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/library/my-history`, { headers: this.getHeaders() });
  }

  // ... (ฟังก์ชันเดิม getCourses, getLibraryHistory)

  // ดึงผลการเรียน
  getStudentGrades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/student/grades`, { headers: this.getHeaders() });
  }

  // ดึงตารางเรียน
  getStudentSchedule(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/student/schedule`, { headers: this.getHeaders() });
  }

  // ดึงตารางสอบ
  getStudentExams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/student/exams`, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลอาจารย์
  getProfessorCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/professor/courses`, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลการให้เกรด
  getProfessorGrades(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/professor/courses/${courseId}/grades`, { headers: this.getHeaders() });
  }

  // บันทึกเกรด
  saveGrades(courseId: string, grades: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/professor/courses/${courseId}/grades`, grades, { headers: this.getHeaders() });
  }

  // เพิ่มเติมสำหรับ Component ใหม่
  getProfessorSchedule(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/professor/schedule`, { headers: this.getHeaders() });
  }

  getStudentsInCourse(courseId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/professor/courses/${courseId}/students`, { headers: this.getHeaders() });
  }

  updateGrade(enrollmentId: any, grade: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/academic/professor/grades/${enrollmentId}`, { grade }, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลนักศึกษา
  getStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/students`, { headers: this.getHeaders() });
  }

  // อัปโหลดไฟล์เกรด (CSV)
  uploadGrades(courseId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/academic/professor/courses/${courseId}/grades/upload`, formData, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลอาจารย์
  getProfessors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/professors`, { headers: this.getHeaders() });
  }

  // เพิ่มอาจารย์ใหม่
  addProfessor(professor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/professors`, professor, { headers: this.getHeaders() });
  }

  // อัปเดตข้อมูลอาจารย์
  updateProfessor(id: string, professor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/academic/professors/${id}`, professor, { headers: this.getHeaders() });
  }

  // ลบอาจารย์
  deleteProfessor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/professors/${id}`, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลวิชาเรียนทั้งหมด
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/courses`, { headers: this.getHeaders() });
  }

  // เพิ่มวิชาเรียนใหม่
  addCourse(course: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/courses`, course, { headers: this.getHeaders() });
  }

  // อัปเดตข้อมูลวิชาเรียน
  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/academic/courses/${id}`, course, { headers: this.getHeaders() });
  }

  // ลบวิชาเรียน
  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/courses/${id}`, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลการลงทะเบียน
  getRegistrations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/registrations`, { headers: this.getHeaders() });
  }

  // ลงทะเบียนวิชาเรียน
  registerCourse(registration: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/registrations`, registration, { headers: this.getHeaders() });
  }

  // ยกเลิกการลงทะเบียน
  cancelRegistration(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/registrations/${id}`, { headers: this.getHeaders() });
  }

  // ดึงข้อมูลการลงทะเบียนของนักศึกษา
  getStudentRegistrations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic/student/registrations`, { headers: this.getHeaders() });
  }

  // ลงทะเบียนวิชาเรียนสำหรับนักศึกษา
  registerCourseForStudent(registration: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/student/registrations`, registration, { headers: this.getHeaders() });
  }

  // ยกเลิกการลงทะเบียนสำหรับนักศึกษา
  cancelRegistrationForStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/student/registrations/${id}`, { headers: this.getHeaders() });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/admin/users`, { headers: this.getHeaders() });
  }

  updateUserStatus(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/admin/users/${userId}`, data, { headers: this.getHeaders() });
  }

  // จัดการห้องสมุด (Admin & Staff)
  getAllLibraryStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/library/manage/status`, { headers: this.getHeaders() });
  }

  processReturnBook(recordId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/library/manage/return`, { record_id: recordId }, { headers: this.getHeaders() });
  }

  clearFine(recordId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/library/manage/clear-fine`, { record_id: recordId }, { headers: this.getHeaders() });
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, { headers: this.getHeaders() });
  }


}