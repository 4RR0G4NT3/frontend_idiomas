export interface Content {
  title: string;
  type: 'text' | 'table' | 'list';
  data: any;
  completed?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: Content[];
  completed: boolean;
}

export interface Level {
  id: string;
  name: string;
  dataFile?: string;
  lessonCount?: number;
  lessons: Lesson[];
}

export interface Language {
  id: string;
  name: string;
  icon?: string;
  levels: Level[];
}
