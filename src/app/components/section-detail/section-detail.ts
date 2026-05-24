import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language';
import { Content } from '../../models/language.model';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-section-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './section-detail.html',
  styleUrl: './section-detail.css'
})
export class SectionDetailComponent implements OnInit {
  sectionData$: Observable<{ 
    langId: string, 
    levelId: string, 
    lessonId: string, 
    content: Content | undefined 
  }>;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.sectionData$ = this.route.paramMap.pipe(
      switchMap(params => {
        const langId = params.get('language') || '';
        const levelId = params.get('level') || '';
        const lessonId = params.get('lesson') || '';
        const sectionIndex = parseInt(params.get('section') || '0', 10);
        
        return this.languageService.getLevel(langId, levelId).pipe(
          map(level => {
            const lesson = level?.lessons.find(l => l.id === lessonId);
            const content = lesson?.content[sectionIndex];
            return { langId, levelId, lessonId, content };
          })
        );
      })
    );
  }

  ngOnInit(): void {}
}
