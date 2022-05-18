import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {LessonFourComponent} from './lesson-four/lesson-four.component';
import {TemplateComponent} from './template/template.component';
import {LessonFiveComponent} from './lesson-five/lesson-five.component';
import {LessonSixComponent} from './lesson-six/lesson-six.component';
import {LessonSevenComponent} from './lesson-seven/lesson-seven.component';
import {LessonEightComponent} from './lesson-eight/lesson-eight.component';
import {LessonNineComponent} from './lesson-nine/lesson-nine.component';
import {LessonTenComponent} from './lesson-ten/lesson-ten.component';
import {LessonElevenComponent} from './lesson-eleven/lesson-eleven.component';
import {LessonTwelveComponent} from './lesson-twelve/lesson-twelve.component';
import {LessonThirteenComponent} from './lesson-thirteen/lesson-thirteen.component';
import {LessonFifteenComponent} from './lesson-fifteen/lesson-fifteen.component';
import {LessonSixteenComponent} from './lesson-sixteen/lesson-sixteen.component';
import {LessonEighteenComponent} from './lesson-eighteen/lesson-eighteen.component';
import {LessonSeventeenComponent} from "./lesson-seventeen/lesson-seventeen.component";
import { LessonNineteenComponent } from './lesson-nineteen/lesson-nineteen.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LessonFourComponent,
    TemplateComponent,
    LessonFiveComponent,
    LessonSixComponent,
    LessonSevenComponent,
    LessonEightComponent,
    LessonNineComponent,
    LessonTenComponent,
    LessonElevenComponent,
    LessonTwelveComponent,
    LessonThirteenComponent,
    LessonFifteenComponent,
    LessonSixteenComponent,
    LessonEighteenComponent,
    LessonNineteenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: 'lesson-four', component: LessonFourComponent},
      {path: 'template', component: TemplateComponent},
      {path: 'lesson-five', component: LessonFiveComponent},
      {path: 'lesson-six', component: LessonSixComponent},
      {path: 'lesson-seven', component: LessonSevenComponent},
      {path: 'lesson-eight', component: LessonEightComponent},
      {path: 'lesson-nine', component: LessonNineComponent},
      {path: 'lesson-ten', component: LessonTenComponent},
      {path: 'lesson-eleven', component: LessonElevenComponent},
      {path: 'lesson-twelve', component: LessonTwelveComponent},
      {path: 'lesson-thirteen', component: LessonThirteenComponent},
      {path: 'lesson-fifteen', component: LessonFifteenComponent},
      {path: 'lesson-sixteen', component: LessonSixteenComponent},
      {path: 'lesson-seventeen', component: LessonSeventeenComponent},
      {path: 'lesson-eighteen', component: LessonEighteenComponent},
      {path:'lesson-nineteen',component:LessonNineteenComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

