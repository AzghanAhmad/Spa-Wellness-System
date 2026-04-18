import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../questionnaire.service';
import { Questionnaire, QuestionGroup, Question, QuestionType, QuestionOption } from '../configuration.component';

@Component({
  selector: 'app-questionnaire-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire-detail.component.html',
  styleUrl: './questionnaire-detail.component.scss'
})
export class QuestionnaireDetailComponent implements OnInit {
  questionnaire = signal<Questionnaire | null>(null);
  selectedGroup = signal<QuestionGroup | null>(null);
  showGroupModal = signal(false);
  showQuestionModal = signal(false);
  groupForm = signal<Partial<QuestionGroup>>({});
  questionForm = signal<Partial<Question>>({});
  questionOptions = signal<QuestionOption[]>([]);
  newOptionLabel = signal('');

  readonly questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Single Choice' },
    { value: 'checkbox', label: 'Multiple Choice' },
    { value: 'select', label: 'Dropdown' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'yesno', label: 'Yes / No' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly qService: QuestionnaireService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.qService.questionnaires().find(q => q.id === id);
    if (!found) { this.router.navigate(['/configuration']); return; }
    this.questionnaire.set(JSON.parse(JSON.stringify(found)));
    if (found.groups.length) this.selectedGroup.set(JSON.parse(JSON.stringify(found.groups[0])));
  }

  goBack(): void { this.router.navigate(['/configuration'], { queryParams: { page: 'questionnaires' } }); }

  save(): void {
    const q = this.questionnaire(); if (!q) return;
    this.syncGroupBack();
    this.qService.questionnaires.update(list => list.map(x => x.id === q.id ? q : x));
  }

  selectGroup(g: QuestionGroup): void {
    this.syncGroupBack();
    this.selectedGroup.set(JSON.parse(JSON.stringify(g)));
  }

  private syncGroupBack(): void {
    const g = this.selectedGroup(); if (!g) return;
    this.questionnaire.update(q => q ? { ...q, groups: q.groups.map(gr => gr.id === g.id ? g : gr) } : q);
  }

  openAddGroup(): void {
    this.groupForm.set({ title: '', type: 'Question', order: (this.questionnaire()?.groups.length ?? 0) + 1 });
    this.showGroupModal.set(true);
  }

  saveGroup(): void {
    const q = this.questionnaire(); if (!q) return;
    const f = this.groupForm(); if (!f.title) return;
    const newId = Math.max(0, ...q.groups.map(g => g.id)) + 1;
    const newGroup: QuestionGroup = { id: newId, title: f.title!, type: f.type ?? 'Question', order: f.order ?? q.groups.length + 1, questions: [] };
    this.questionnaire.update(x => x ? { ...x, groups: [...x.groups, newGroup] } : x);
    this.selectedGroup.set(newGroup);
    this.showGroupModal.set(false);
  }

  deleteGroup(groupId: number): void {
    this.questionnaire.update(x => x ? { ...x, groups: x.groups.filter(g => g.id !== groupId) } : x);
    if (this.selectedGroup()?.id === groupId) {
      const remaining = this.questionnaire()?.groups ?? [];
      this.selectedGroup.set(remaining.length ? remaining[0] : null);
    }
  }

  openAddQuestion(): void {
    if (!this.selectedGroup()) return;
    this.questionForm.set({ label: '', type: 'text', required: false, placeholder: '', order: (this.selectedGroup()?.questions.length ?? 0) + 1 });
    this.questionOptions.set([]);
    this.showQuestionModal.set(true);
  }

  addOption(): void {
    const label = this.newOptionLabel().trim(); if (!label) return;
    const newId = Math.max(0, ...this.questionOptions().map(o => o.id), 0) + 1;
    this.questionOptions.update(opts => [...opts, { id: newId, label }]);
    this.newOptionLabel.set('');
  }

  removeOption(id: number): void { this.questionOptions.update(opts => opts.filter(o => o.id !== id)); }

  saveQuestion(): void {
    const g = this.selectedGroup(); if (!g) return;
    const f = this.questionForm(); if (!f.label) return;
    const newId = Math.max(0, ...g.questions.map(x => x.id), 0) + 1;
    const newQ: Question = { id: newId, label: f.label!, type: f.type ?? 'text', required: f.required ?? false, options: this.questionOptions(), placeholder: f.placeholder ?? '', order: f.order ?? g.questions.length + 1 };
    const updatedGroup = { ...g, questions: [...g.questions, newQ] };
    this.selectedGroup.set(updatedGroup);
    this.questionnaire.update(x => x ? { ...x, groups: x.groups.map(gr => gr.id === g.id ? updatedGroup : gr) } : x);
    this.showQuestionModal.set(false);
  }

  deleteQuestion(questionId: number): void {
    const g = this.selectedGroup(); if (!g) return;
    const updatedGroup = { ...g, questions: g.questions.filter(q => q.id !== questionId) };
    this.selectedGroup.set(updatedGroup);
    this.questionnaire.update(x => x ? { ...x, groups: x.groups.map(gr => gr.id === g.id ? updatedGroup : gr) } : x);
  }

  hasOptions(type: QuestionType | undefined): boolean { return ['radio', 'checkbox', 'select'].includes(type ?? ''); }
}
