import { Component, Injectable, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class CounterService {
  private _count = 0;

  get count() {
    return this._count;
  }
  increase() {
    this._count += 1;
  }
  decrease() {
    this._count -= 1;
  }
  reset() {
    this._count = 0;
  }
}

class Counter {
  count: number = 0;

  increase() {
    this.count += 1;
  }
  decrease() {
    this.count -= 1;
  }
}

@Component({
  selector: 'app-root',
  imports: [ CommonModule, RouterLink, RouterOutlet ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  title: String = 'Hello World!';

  counterService = new CounterService();

  getCurrentValue() {
    return this.counterService.count;
  }

  increase() {
    this.counterService.increase();
  }
  
  decrease() {
    this.counterService.decrease();
  }
  reset() {
    this.counterService.reset();
  }
}