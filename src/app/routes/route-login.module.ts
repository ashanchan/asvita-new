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
import { AuthGuard } from './../services/auth-guard.service';
import { GraphComponent } from '../components/record/graph.component';
import { AboutComponent } from '../components/about/about.component';
import { LogoutComponent } from '../components/login/logout.component';
//==============================================================================
var routes: Route[] = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change', component: ChangeComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },  
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/doc', component: DocProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/pat', component: PatProfileComponent, canActivate: [AuthGuard] },
  { path: 'record/prescription', component: PrescriptionComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'record/graph', component: GraphComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent }
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
