import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="flex flex-col items-center justify-center h-[400px] text-center">
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
        <i class="fas fa-file-alt h-8 w-8 text-gray-400 dark:text-gray-300"></i>
      </div>
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm">{{ description }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title!: string;
  @Input() description!: string;
}

