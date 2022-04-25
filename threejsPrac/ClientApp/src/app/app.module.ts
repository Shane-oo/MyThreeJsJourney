import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LessonFourComponent } from './lesson-four/lesson-four.component';
import { TemplateComponent } from './template/template.component';
import { LessonFiveComponent } from './lesson-five/lesson-five.component';
import { LessonSixComponent } from './lesson-six/lesson-six.component';
import { LessonSevenComponent } from './lesson-seven/lesson-seven.component';
import { LessonEightComponent } from './lesson-eight/lesson-eight.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LessonFourComponent,
    TemplateComponent,
    LessonFiveComponent,
    LessonSixComponent,
    LessonSevenComponent,
    LessonEightComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'lesson-four', component: LessonFourComponent },
      { path: 'template', component: TemplateComponent },
      { path: 'lesson-five', component: LessonFiveComponent },
      { path: 'lesson-six', component: LessonSixComponent },
      { path: 'lesson-seven', component: LessonSevenComponent },
      { path: 'lesson-eight', component: LessonEightComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

