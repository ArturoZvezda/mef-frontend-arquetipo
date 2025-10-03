import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { MefUiLoaderService } from '@mef-frontend-arquetipo/shared';

/**
 * Wrapper component for MEF UI Alert
 *
 * This component wraps the remote mef-ui Alert component for displaying
 * notifications and feedback messages.
 *
 * @example
 * ```html
 * <mef-alert-wrapper
 *   type="success"
 *   title="Success!"
 *   message="Operation completed successfully">
 * </mef-alert-wrapper>
 * ```
 */
@Component({
  selector: 'mef-alert-wrapper',
  standalone: true,
  template: `<div #container></div>`
})
export class MefAlertWrapperComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() closable: boolean = true;

  private componentRef?: ComponentRef<any>;

  constructor(private mefUiLoader: MefUiLoaderService) {}

  async ngOnInit() {
    try {
      const AlertComponent = await this.mefUiLoader.loadAlert();
      this.componentRef = this.container.createComponent(AlertComponent.AlertComponent);

      this.componentRef.instance.type = this.type;
      this.componentRef.instance.title = this.title;
      this.componentRef.instance.message = this.message;
      this.componentRef.instance.closable = this.closable;
    } catch (error) {
      console.error('Failed to load MEF UI Alert component:', error);
    }
  }
}
