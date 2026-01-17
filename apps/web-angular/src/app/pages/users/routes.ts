import { Routes } from '@angular/router';
import { View } from './components/view';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: View
      }
    ]
  }
] satisfies Routes