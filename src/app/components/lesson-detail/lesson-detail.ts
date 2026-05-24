import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language';
import { Lesson } from '../../models/language.model';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-detail.html',
  styleUrl: './lesson-detail.css'
})
export class LessonDetailComponent implements OnInit {
  lessonData$: Observable<{ langId: string, levelId: string, lesson: Lesson | undefined }>;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.lessonData$ = this.route.paramMap.pipe(
      switchMap(params => {
        const langId = params.get('language') || '';
        const levelId = params.get('level') || '';
        const lessonId = params.get('lesson') || '';
        
        return this.languageService.getLevel(langId, levelId).pipe(
          map(level => {
            const lesson = level?.lessons.find(l => l.id === lessonId);
            return { langId, levelId, lesson };
          })
        );
      })
    );
  }

  ngOnInit(): void {}

  toggleSection(langId: string, levelId: string, lessonId: string, index: number, event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking the toggle
    this.languageService.toggleSectionCompletion(langId, levelId, lessonId, index);
  }
}
