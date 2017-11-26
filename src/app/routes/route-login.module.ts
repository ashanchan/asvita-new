import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
//==============================================================================
import { LoginComponent } from '../components/login/login.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { ForgotComponent } from '../components/login/forgot.component';
import { ChangeComponent } from '../components/login/change.component';
import { RegisterComponent } from '../components/login/register.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DocProfileComponent } from '../components/profile/doc-profile.component';
import { PatProfileComponent } from '../components/profile/pat-profile.component ';
import { SearchComponent } from '../components/search/search.component';
import { PrescriptionComponent } from '../components/record/prescription.component';

//==============================================================================
var routes: Route[] = [
  { path: '', component: LoginComponent },
  { path: 'login/login', component: LoginComponent },
  { path: 'login/forgot', component: ForgotComponent },
  { path: 'login/change', component: ChangeComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile/doc', component: DocProfileComponent },
  { path: 'profile/pat', component: PatProfileComponent },
  { path: 'record/prescription', component: PrescriptionComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', component: PageNotFoundComponent }
];
//==============================================================================
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
//==============================================================================
export class RouteLoginModule { }
//==============================================================================
