import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { Language, Level, Lesson } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languagesSubject = new BehaviorSubject<Language[]>([]);
  languages$ = this.languagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLanguages();
  }

  private loadLanguages() {
    this.http.get<Language[]>('assets/data/languages.json').subscribe({
      next: (data) => {
        this.languagesSubject.next(data);
      },
      error: (err) => console.error('Error loading index:', err)
    });
  }

  getLanguages(): Observable<Language[]> {
    return this.languages$.pipe(
      filter(langs => langs.length > 0)
    );
  }

  getLanguage(id: string): Observable<Language | undefined> {
    return this.getLanguages().pipe(
      map(langs => langs.find(l => l.id === id))
    );
  }

  getLevel(langId: string, levelId: string): Observable<Level | undefined> {
    return this.getLanguage(langId).pipe(
      switchMap(lang => {
        const level = lang?.levels.find(lvl => lvl.id === levelId);
        if (!level) return of(undefined);
        
        if (level.lessons && level.lessons.length > 0) {
          return of(level);
        }

        return this.http.get<Lesson[]>(`assets/data/${level.dataFile}`).pipe(
          map(lessons => {
            const savedProgress = JSON.parse(localStorage.getItem('language_progress_v2') || '{}');
            const enrichedLessons = lessons.map(lesson => {
              const enrichedContent = lesson.content.map((section, index) => ({
                ...section,
                completed: savedProgress[`${langId}_${levelId}_${lesson.id}_${index}`] || false
              }));
              
              const allCompleted = enrichedContent.every(s => s.completed);
              
              return {
                ...lesson,
                content: enrichedContent,
                completed: allCompleted
              };
            });
            
            this.updateLocalState(langId, levelId, enrichedLessons);
            return { ...level, lessons: enrichedLessons };
          })
        );
      })
    );
  }

  private updateLocalState(langId: string, levelId: string, lessons: Lesson[]) {
    const currentLangs = this.languagesSubject.value;
    const updatedLangs = currentLangs.map(l => {
      if (l.id !== langId) return l;
      return {
        ...l,
        levels: l.levels.map(lvl => {
          if (lvl.id !== levelId) return lvl;
          return { ...lvl, lessons: lessons };
        })
      };
    });
    this.languagesSubject.next(updatedLangs);
  }

  toggleSectionCompletion(langId: string, levelId: string, lessonId: string, sectionIndex: number) {
    const progress = JSON.parse(localStorage.getItem('language_progress_v2') || '{}');
    const key = `${langId}_${levelId}_${lessonId}_${sectionIndex}`;
    
    progress[key] = !progress[key];
    localStorage.setItem('language_progress_v2', JSON.stringify(progress));

    const currentLangs = this.languagesSubject.value;
    const updatedLangs = currentLangs.map(lang => {
      if (lang.id !== langId) return lang;
      return {
        ...lang,
        levels: lang.levels.map(level => {
          if (level.id !== levelId) return level;
          return {
            ...level,
            lessons: level.lessons.map(lesson => {
              if (lesson.id !== lessonId) return lesson;
              const updatedContent = lesson.content.map((s, idx) => 
                idx === sectionIndex ? { ...s, completed: progress[key] } : s
              );
              return {
                ...lesson,
                content: updatedContent,
                completed: updatedContent.every(s => s.completed)
              };
            })
          };
        })
      };
    });
    this.languagesSubject.next(updatedLangs);
  }
}
