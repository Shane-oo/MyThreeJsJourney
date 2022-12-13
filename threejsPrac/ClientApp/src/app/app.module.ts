import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LessonFourComponent } from './lesson-four/lesson-four.component';
import { TemplateComponent } from './template/template.component';
import { LessonFiveComponent } from './lesson-five/lesson-five.component';
import { LessonSixComponent } from './lesson-six/lesson-six.component';
import { LessonSevenComponent } from './lesson-seven/lesson-seven.component';
import { LessonEightComponent } from './lesson-eight/lesson-eight.component';
import { LessonNineComponent } from './lesson-nine/lesson-nine.component';
import { LessonTenComponent } from './lesson-ten/lesson-ten.component';
import { LessonElevenComponent } from './lesson-eleven/lesson-eleven.component';
import { LessonTwelveComponent } from './lesson-twelve/lesson-twelve.component';
import { LessonThirteenComponent } from './lesson-thirteen/lesson-thirteen.component';
import { LessonFifteenComponent } from './lesson-fifteen/lesson-fifteen.component';
import { LessonSixteenComponent } from './lesson-sixteen/lesson-sixteen.component';
import { LessonEighteenComponent } from './lesson-eighteen/lesson-eighteen.component';
import { LessonSeventeenComponent } from './lesson-seventeen/lesson-seventeen.component';
import { LessonNineteenComponent } from './lesson-nineteen/lesson-nineteen.component';
import { LessonTwentyComponent } from './lesson-twenty/lesson-twenty.component';
import { LessonTwentyOneComponent } from './lesson-twenty-one/lesson-twenty-one.component';
import { LessonTwentyTwoComponent } from './lesson-twenty-two/lesson-twenty-two.component';
import { LessonTwentyThreeComponent } from './lesson-twenty-three/lesson-twenty-three.component';
import { LessonTwentySevenComponent } from './lesson-twenty-seven/lesson-twenty-seven.component';
import { LessonTwentyNineComponent } from './lesson-twenty-nine/lesson-twenty-nine.component';
import { LessonTwentyEightComponent } from './lesson-twenty-eight/lesson-twenty-eight.component';
import { LessonThirtyComponent } from './lesson-thirty/lesson-thirty.component';
import { PractiseComponent } from './practise/practise.component';
import { LessonThirtyOneComponent } from './lesson-thirty-one/lesson-thirty-one.component';

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
              LessonNineteenComponent,
              LessonTwentyComponent,
              LessonTwentyOneComponent,
              LessonTwentyTwoComponent,
              LessonTwentyThreeComponent,
              LessonTwentySevenComponent,
              LessonTwentyEightComponent,
              LessonTwentyNineComponent,
              LessonThirtyComponent,
              PractiseComponent,
              LessonThirtyOneComponent
            ],
            imports: [
              BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
              HttpClientModule,
              FormsModule,
              RouterModule.forRoot([
                                     {path: '', component: HomeComponent, pathMatch: 'full'},
                                     {path: 'practise', component: PractiseComponent},
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
                                     {path: 'lesson-nineteen', component: LessonNineteenComponent},
                                     {path: 'lesson-twenty', component: LessonTwentyComponent},
                                     {path: 'lesson-twenty-one', component: LessonTwentyOneComponent},
                                     {path: 'lesson-twenty-two', component: LessonTwentyTwoComponent},
                                     {path: 'lesson-twenty-three', component: LessonTwentyThreeComponent},
                                     {path: 'lesson-twenty-seven', component: LessonTwentySevenComponent},
                                     {path: 'lesson-twenty-eight', component: LessonTwentyEightComponent},
                                     {path: 'lesson-twenty-nine', component: LessonTwentyNineComponent},
                                     {path: 'lesson-thirty', component: LessonThirtyComponent},
                                     {path: 'lesson-thirty-one', component: LessonThirtyOneComponent}
                                   ])
            ],
            providers: [],
            bootstrap: [AppComponent]
          })
export class AppModule {
}

