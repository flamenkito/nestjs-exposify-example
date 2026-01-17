import { Directive, effect, ElementRef, inject, input, WritableSignal } from '@angular/core';

@Directive({
  selector: 'input[signal], textarea[signal]',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class SignalInputDirective {
  private readonly el = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);

  signal = input.required<WritableSignal<string>>();

  constructor() {
    effect(() => {
      this.el.nativeElement.value = this.signal()();
    });
  }

  onInput(event: Event) {
    this.signal().set((event.target as HTMLInputElement).value);
  }
}
