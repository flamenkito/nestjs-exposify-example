import { Component, input } from '@angular/core';
import { UserDto } from '../../generated';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <p class="id">{{ user().id }}</p>
    </div>
  `,
})
export class UserCardComponent {
  user = input.required<UserDto>();
}
