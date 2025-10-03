import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

/**
 * Wrapper component for MEF UI TextField
 *
 * This component wraps the remote mef-ui TextField component for
 * input field functionality within the hexagonal architecture.
 *
 * @example
 * ```html
 * <mef-text-field-wrapper
 *   label="Email"
 *   placeholder="Enter your email"
 *   type="email"
 *   [(ngModel)]="email">
 * </mef-text-field-wrapper>
 * ```
 */
@Component({
  selector: 'mef-text-field-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class MefTextFieldWrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();

  private componentRef?: ComponentRef<any>;

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    try {
      const TextFieldComponent = await this.mefUiLoader.loadTextField();
      this.componentRef = this.container.createComponent(TextFieldComponent.TextFieldComponent);

      this.componentRef.instance.label = this.label;
      this.componentRef.instance.placeholder = this.placeholder;
      this.componentRef.instance.disabled = this.disabled;
      this.componentRef.instance.required = this.required;
      this.componentRef.instance.type = this.type;
      this.componentRef.instance.value = this.value;

      // Subscribe to value changes if available
      if (this.componentRef.instance.valueChange) {
        this.componentRef.instance.valueChange.subscribe((value: string) => {
          this.valueChange.emit(value);
        });
      }
    } catch (error) {
      console.error('Failed to load MEF UI TextField component:', error);
    }
  }
}
