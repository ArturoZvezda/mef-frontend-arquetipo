import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

/**
 * Wrapper component for MEF UI Button
 *
 * This component wraps the remote mef-ui Button component and provides
 * a consistent interface within the hexagonal architecture.
 *
 * @example
 * ```html
 * <mef-button-wrapper
 *   variant="filled"
 *   textButton="Click Me"
 *   (onClick)="handleClick()">
 * </mef-button-wrapper>
 * ```
 */
@Component({
  selector: 'mef-button-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class MefButtonWrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  // Button properties
  @Input() variant: 'filled' | 'outlined' | 'text' = 'filled';
  @Input() size: 'default' | 'small' = 'default';
  @Input() disabled: boolean = false;
  @Input() textButton: string = 'Button';
  @Input() leadingIcon: boolean = false;
  @Input() activated: boolean = false;
  @Input() icon: string = '';

  @Output() onClick = new EventEmitter<void>();

  private componentRef?: ComponentRef<any>;

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    try {
      const ButtonComponent = await this.mefUiLoader.loadButton();
      this.componentRef = this.container.createComponent(ButtonComponent.ButtonComponent);

      // Set inputs
      this.componentRef.instance.variant = this.variant;
      this.componentRef.instance.size = this.size;
      this.componentRef.instance.disabled = this.disabled;
      this.componentRef.instance.textButton = this.textButton;
      this.componentRef.instance.leadingIcon = this.leadingIcon;
      this.componentRef.instance.activated = this.activated;
      this.componentRef.instance.icon = this.icon;

      // Subscribe to outputs if available
      if (this.componentRef.instance.onClick) {
        this.componentRef.instance.onClick.subscribe(() => {
          this.onClick.emit();
        });
      }
    } catch (error) {
      console.error('Failed to load MEF UI Button component:', error);
    }
  }
}
