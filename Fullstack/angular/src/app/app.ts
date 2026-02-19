import { Component, EventEmitter, Input, Output, Injectable, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgStyle } from '@angular/common';

// --- Interfaces ---
interface User {
  id: number;
  name: string;
  age: number;
}

export interface Calculate {
  operand1: number;
  operand2: number;
  operation: string;
  result: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  
  compute(op1: number, op2: number, operation: string): number {
    let result = 0;
    switch (operation) {
      case 'add':
        result = op1 + op2;
        break;
      case 'subtract':
        result = op1 - op2;
        break;
      case 'multiply':
        result = op1 * op2;
        break;
      case 'divide':
        if (op2 !== 0) {
          result = op1 / op2;
        } else {
          throw new Error("Cannot divide by zero");
        }
        break;
    }
    return result;
  }
}

@Component({
  selector: 'calculation-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 5px; border-radius: 5px; background-color: #f9f9f9;">
      <span>
        {{ calculationData.operand1 }} 
        <span [ngSwitch]="calculationData.operation" style="font-weight: bold; color: blue;">
          <span *ngSwitchCase="'add'">+</span>
          <span *ngSwitchCase="'subtract'">-</span>
          <span *ngSwitchCase="'multiply'">*</span>
          <span *ngSwitchCase="'divide'">/</span>
        </span>
        {{ calculationData.operand2 }} 
        = 
        <strong style="color: green;">{{ calculationData.result }}</strong>
      </span>
      
      <button (click)="onDelete()" style="margin-left: 15px; color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer;">Delete</button>
    </div>
  `
})
export class CalculationRow {
  @Input() calculationData!: Calculate;
  @Output() calculationDeleted = new EventEmitter<Calculate>();

  onDelete() {
    this.calculationDeleted.emit(this.calculationData);
  }
}

@Component({
  selector: 'user-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="border-bottom: 1px solid #eee; padding: 10px;">
      ID: <b>{{ userData.id }}</b> | Name: {{ userData.name }} | Age: {{ userData.age }}
      <button (click)="deleteUser()" style="margin-left: 10px; color: red; cursor: pointer;">Delete User</button>
    </div>`
})
export class UserRow {
  @Input() userData!: User;
  @Output() userDeleted = new EventEmitter<User>();

  deleteUser() {
    this.userDeleted.emit(this.userData);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, UserRow, CalculationRow, NgClass, NgStyle], 
  templateUrl: `app.html`
})
export class App {
  private calculationService = inject(CalculationService);

  calcForm = new FormGroup({
    operand1: new FormControl(10, [Validators.required]),
    operand2: new FormControl(5, [Validators.required]),
    operation: new FormControl('add', [Validators.required])
  });

  currentResult: number = 0; 
  errorMessage: string = '';
  calculations: Calculate[] = [];

  name: string = '';
  age: number = 0;
  users: User[] = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
  ];

  calculate() {
    this.errorMessage = ''; 
    
    if (this.calcForm.invalid) return;

    const { operand1, operand2, operation } = this.calcForm.getRawValue();

    try {

      const result = this.calculationService.compute(operand1!, operand2!, operation!);
      
      this.currentResult = result;

      const newCalculation: Calculate = {
        operand1: operand1!,
        operand2: operand2!,
        operation: operation!,
        result: result
      };
      
      this.calculations.push(newCalculation);

    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  onDeleteCalculation(itemToDelete: Calculate) {
    this.calculations = this.calculations.filter(item => item !== itemToDelete);
  }

  // --- User Logic (Unchanged) ---
  onDeleteUser(userToDelete: User) {
    this.users = this.users.filter(user => user.id !== userToDelete.id);
  }

  submit() {
    if(!this.name) return; 
    let newUser: User = {
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      name: this.name,
      age: this.age
    };
    this.users.push(newUser);
    this.name = '';
    this.age = 0;
  }
}

bootstrapApplication(App);