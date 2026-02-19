import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule,Validators, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: 'form-component',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div>
        Hello World from Form Demo Component! 
        <br>
        CurrentID: {{ currentId }}
    </div>
    <br>
    <br>
    <form [formGroup]="profileForm">
        <label>Name: </label>
        <input type="text" name="name" formControlName="name">
        @if(profileForm.controls['name'].invalid && profileForm.controls['name'].touched) {
            <span style="color:red;">Data invalid.</span>
        }
            
        <br>
        <label>Age: </label>
        <input type="number" name="age" formControlName="age">
        <br>
        <label>Email: </label>
        <input type="text" name="email" formControlName="email">
        <div>
            @for(group of addressControls.controls; track group; let i = $index) {
                <div [formGroup]=$any(group) style="margin-bottom: 5px;">
                    Provinice : 
                    <input type="text" formControlName="province">
                    District :
                    <input type="text" formControlName="district">

                    <button type="button" (click)="removeAddress(i)">Remove</button>
                </div>
            }
            
            <button type="button" (click)="addAddress()">+ Add Address</button>
        </div>
    </form>
    <button type="submit" [disabled]="profileForm.invalid" (click)="submitProfile()">Submit</button>
    <br>
    <br>
    <br>
    <button (click)="observeSample()">observeSample</button>
    `
})
export class FormDemoComponent {
    currentId: string | null = null;

    profileForm: FormGroup;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.route.paramMap.subscribe(params => {
            this.currentId = params.get('id');
        });

        this.profileForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            age: new FormControl('', [Validators.min(0), Validators.max(150)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            address: new FormArray([])
        });

    }
    submitProfile() {
        alert(JSON.stringify(this.profileForm.value, null, 2));  
    }

    get addressControls() {
        return this.profileForm.get('address') as FormArray;
    }

    addAddress() {
        const addressGroup = new FormGroup({
            province: new FormControl('', Validators.required),
            district: new FormControl('', Validators.required)
        });
        
        this.addressControls.push(addressGroup);
    }

    removeAddress(index: number) {
        this.addressControls.removeAt(index);
    }

    observeSample() {
        let observe1 = this.http.get("https://meowfacts.herokuapp.com/?count=2");
        let observe2 = this.http.get("https://meowfacts.herokuapp.com/?count=2");

        merge(observe1, observe2).subscribe(res => {
            alert(JSON.stringify(res));
        })

        let mappedForFirstObject = observe1.pipe(map(val => {
            let obj = JSON.parse(JSON.stringify(val));
            return obj.data[0];
        }))

        mappedForFirstObject.subscribe(x => {
            alert(x);
        })
    }
}

    