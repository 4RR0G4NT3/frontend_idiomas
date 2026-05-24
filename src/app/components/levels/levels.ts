import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language';
import { Language } from '../../models/language.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './levels.html',
  styleUrl: './levels.css'
})
export class LevelsComponent implements OnInit {
  language$: Observable<Language | undefined>;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.language$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('language') || '';
        return this.languageService.getLanguage(id);
      })
    );
  }

  ngOnInit(): void {}
}
