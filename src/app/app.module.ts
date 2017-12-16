//==============================================================================
//  Main Modules
//==============================================================================
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouteLoginModule } from './routes/route-login.module';
//==============================================================================
// 
//==============================================================================
import { HttpService } from './services/http.service';
import { DataService } from './services/data.service';
import { MessageService } from './services/message.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { AuthGuard } from './services/auth-guard.service';
//==============================================================================
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotComponent } from './components/login/forgot.component';
import { ChangeComponent } from './components/login/change.component';
import { RegisterComponent } from './components/login/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocProfileComponent } from './components/profile/doc-profile.component';
import { PatProfileComponent } from './components/profile/pat-profile.component ';
import { SearchComponent } from './components/search/search.component';
import { PanelLeftComponent } from './components/panel/panel-left.component';
import { PanelRightComponent } from './components/panel/panel-right.component';
import { PanelTopComponent } from './components/panel/panel-top.component';
import { PanelBottomComponent } from './components/panel/panel-bottom.component';
import { ProfileImgPipe } from './pipes/profile-img.pipe';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { PrescriptionComponent } from './components/record/prescription.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { GraphComponent } from './components/record/graph.component';
import { AboutComponent } from './components/about/about.component';
import { LogoutComponent } from './components/login/logout.component';
//==============================================================================
// 
//==============================================================================
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    ForgotComponent,
    ChangeComponent,
    RegisterComponent,
    DashboardComponent,
    DocProfileComponent,
    PatProfileComponent,
    SearchComponent,
    PanelLeftComponent,
    PanelRightComponent,
    PanelTopComponent,
    PanelBottomComponent,
    ProfileImgPipe,
    ImageUploadComponent,
    PrescriptionComponent,
    ConnectionComponent,
    GraphComponent,
    AboutComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouteLoginModule
  ],
  providers: [HttpService, DataService, MessageService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
