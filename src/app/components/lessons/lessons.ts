import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language';
import { Lesson } from '../../models/language.model';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css'
})
export class LessonsComponent implements OnInit {
  levelData$: Observable<{ langId: string, level: Lesson[] | any }>; // Using any to avoid complex nested types in template for now

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.levelData$ = this.route.paramMap.pipe(
      switchMap(params => {
        const langId = params.get('language') || '';
        const levelId = params.get('level') || '';
        return this.languageService.getLevel(langId, levelId).pipe(
          map(level => ({ langId, level }))
        );
      })
    );
  }

  ngOnInit(): void {}

  getCompletedCount(level: any): number {
    return level?.lessons?.filter((l: any) => l.completed).length || 0;
  }
}
