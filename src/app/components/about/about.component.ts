import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private api = inject(ApiService);
  values = toSignal(this.api.getAboutValues(), { initialValue: [] });
  stats  = toSignal(this.api.getAboutStats(),  { initialValue: [] });
}
