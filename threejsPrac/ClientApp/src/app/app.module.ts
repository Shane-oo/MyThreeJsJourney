import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {LessonFourComponent} from './basics/lesson-four/lesson-four.component';
import {TemplateComponent} from './template/template.component';
import {LessonFiveComponent} from './basics/lesson-five/lesson-five.component';
import {LessonSixComponent} from './basics/lesson-six/lesson-six.component';
import {LessonSevenComponent} from './basics/lesson-seven/lesson-seven.component';
import {LessonEightComponent} from './basics/lesson-eight/lesson-eight.component';
import {LessonNineComponent} from './basics/lesson-nine/lesson-nine.component';
import {LessonTenComponent} from './basics/lesson-ten/lesson-ten.component';
import {LessonElevenComponent} from './basics/lesson-eleven/lesson-eleven.component';
import {LessonTwelveComponent} from './basics/lesson-twelve/lesson-twelve.component';
import {LessonThirteenComponent} from './basics/lesson-thirteen/lesson-thirteen.component';
import {LessonFifteenComponent} from './classic-techniques/lesson-fifteen/lesson-fifteen.component';
import {LessonSixteenComponent} from './classic-techniques/lesson-sixteen/lesson-sixteen.component';
import {LessonEighteenComponent} from './classic-techniques/lesson-eighteen/lesson-eighteen.component';
import {LessonSeventeenComponent} from './classic-techniques/lesson-seventeen/lesson-seventeen.component';
import {LessonNineteenComponent} from './classic-techniques/lesson-nineteen/lesson-nineteen.component';
import {LessonTwentyComponent} from './classic-techniques/lesson-twenty/lesson-twenty.component';
import {LessonTwentyOneComponent} from './classic-techniques/lesson-twenty-one/lesson-twenty-one.component';
import {LessonTwentyTwoComponent} from './advanced-techniques/lesson-twenty-two/lesson-twenty-two.component';
import {LessonTwentyThreeComponent} from './advanced-techniques/lesson-twenty-three/lesson-twenty-three.component';
import {LessonTwentySevenComponent} from './shaders/lesson-twenty-seven/lesson-twenty-seven.component';
import {LessonTwentyNineComponent} from './shaders/lesson-twenty-nine/lesson-twenty-nine.component';
import {LessonTwentyEightComponent} from './shaders/lesson-twenty-eight/lesson-twenty-eight.component';
import {LessonThirtyComponent} from './shaders/lesson-thirty/lesson-thirty.component';
import {PractiseComponent} from './practise/practise.component';
import {LessonThirtyOneComponent} from './shaders/lesson-thirty-one/lesson-thirty-one.component';
import {LessonThirtyTwoComponent} from './extra/lesson-thirty-two/lesson-thirty-two.component';
import {LessonThirtyThreeComponent} from './extra/lesson-thirty-three/lesson-thirty-three.component';
import {LessonThirtyFourComponent} from './extra/lesson-thirty-four/lesson-thirty-four.component';
import {LessonThirtyFiveComponent} from './extra/lesson-thirty-five/lesson-thirty-five.component';
import {LessonThirtyEightComponent} from './portal-scene/lesson-thirty-eight/lesson-thirty-eight.component';
import {RoofRoofierComponent} from './practise/roof-roofier/roof-roofier.component';
import {SandComponent} from './practise/sand/sand.component';
import {RoofComponent} from './practise/roof/roof.component';
import {TilesComponent} from './practise/tiles/tiles.component';
import {CombineMapsComponent} from './practise/combine-maps/combine-maps.component';
import {KitchenDoorProfileComponent} from './practise/kitchen-door-profile/kitchen-door-profile.component';
import { ToneMappingDemoComponent } from './practise/tone-mapping-demo/tone-mapping-demo.component';

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
    LessonThirtyOneComponent,
    LessonThirtyTwoComponent,
    LessonThirtyThreeComponent,
    LessonThirtyFourComponent,
    LessonThirtyFiveComponent,
    LessonThirtyEightComponent,
    RoofRoofierComponent,
    SandComponent,
    RoofComponent,
    TilesComponent,
    CombineMapsComponent,
    KitchenDoorProfileComponent,
    ToneMappingDemoComponent
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
      {path: 'lesson-thirty-one', component: LessonThirtyOneComponent},
      {path: 'lesson-thirty-two', component: LessonThirtyTwoComponent},
      {path: 'lesson-thirty-three', component: LessonThirtyThreeComponent},
      {path: 'lesson-thirty-four', component: LessonThirtyFourComponent},
      {path: 'lesson-thirty-five', component: LessonThirtyFiveComponent},
      {path: 'lesson-thirty-eight', component: LessonThirtyEightComponent},
      {path: 'roof-roofier', component: RoofRoofierComponent},
      {path: 'sand', component: SandComponent},
      {path: 'roof', component: RoofComponent},
      {path: 'tiles', component: TilesComponent},
      {path: 'combine-maps', component: CombineMapsComponent},
      {path: 'profiles', component: KitchenDoorProfileComponent},
      {path: 'tone-mapping', component: ToneMappingDemoComponent}

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

