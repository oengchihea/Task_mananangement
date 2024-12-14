import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  template: `
    <div class="flex gap-1">
      <button
        (click)="onViewChange('grid')"
        [class.bg-blue-100]="view === 'grid'"
        class="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900"
      >
        <i class="fas fa-th-large"></i>
      </button>
      <button
        (click)="onViewChange('list')"
        [class.bg-blue-100]="view === 'list'"
        class="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900"
      >
        <i class="fas fa-list"></i>
      </button>
    </div>
  `
})
export class ViewToggleComponent {
  @Input() view!: 'grid' | 'list';
  @Output() viewChange = new EventEmitter<'grid' | 'list'>();

  onViewChange(newView: 'grid' | 'list') {
    this.viewChange.emit(newView);
  }
}

