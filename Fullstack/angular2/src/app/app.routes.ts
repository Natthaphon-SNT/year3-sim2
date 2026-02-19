import { Routes } from '@angular/router';
import { FormDemoComponent } from './form.component';

export const routes: Routes = [
    {path: 'form-demo', component: FormDemoComponent},
    //{path: 'form-demo/:id', component: FormDemoComponent},
    //{path: '', redirectTo: '/form-demo', pathMatch: 'full'},
    /*{path: 'mainpath', component: RoutingDemoComponent, children: [
        //https://localhost:4200/mainpath/path1
        {path: 'path1', component: RoutingDemoPath1Component },
        //https://localhost:4200/mainpath/path2
        {path: 'path2', component: RoutingDemoPath2Component },
    }
    */
];




