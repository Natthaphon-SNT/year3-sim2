import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-library.html',
  styleUrls: ['../courses/courses.css']
})
export class AdminLibraryComponent implements OnInit {
  records: any[] = [];
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.isLoading = true;
    this.apiService.getAllLibraryStatus().subscribe({
      next: (data: any[]) => {
        this.records = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  processReturn(recordId: number) {
    if(confirm('ยืนยันการรับคืนหนังสือ?')) {
      this.apiService.processReturnBook(recordId).subscribe({
        next: (res: any) => {
          alert(`รับคืนสำเร็จ!\nสถานะ: ${res.status}\nค่าปรับที่ต้องชำระ: ${res.fine_amount} บาท`);
          this.loadRecords();
        },
        error: (err: any) => alert('เกิดข้อผิดพลาด: ' + err.error?.error || 'ไม่สามารถทำรายการได้')
      });
    }
  }

  payFine(recordId: number) {
    if(confirm('ยืนยันการชำระเงินค่าปรับเรียบร้อยแล้ว?')) {
      this.apiService.clearFine(recordId).subscribe({
        next: () => {
          alert('เคลียร์ค่าปรับสำเร็จ!');
          this.loadRecords();
        },
        error: () => alert('เกิดข้อผิดพลาดในการชำระค่าปรับ')
      });
    }
  }
}