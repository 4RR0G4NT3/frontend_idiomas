import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language';
import { Language } from '../../models/language.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  languages$: Observable<Language[]>;

  constructor(private languageService: LanguageService) {
    this.languages$ = this.languageService.getLanguages();
  }

  ngOnInit(): void {}
}
