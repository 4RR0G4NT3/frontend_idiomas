import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LevelsComponent } from './components/levels/levels';
import { LessonsComponent } from './components/lessons/lessons';
import { LessonDetailComponent } from './components/lesson-detail/lesson-detail';
import { SectionDetailComponent } from './components/section-detail/section-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':language', component: LevelsComponent },
  { path: ':language/:level', component: LessonsComponent },
  { path: ':language/:level/:lesson', component: LessonDetailComponent },
  { path: ':language/:level/:lesson/:section', component: SectionDetailComponent },
  { path: '**', redirectTo: '' }
];
