import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { RemoteLoaderService } from '../config/remote-loader.service';
import { applyInputs } from '../config/apply-inputs.util';

@Component({
  selector: 'mef-list',
  standalone: true,
  template: `<ng-container #vc></ng-container>`,
})
export class MefListRemoteComponent implements OnChanges {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

  // Props de diseño
  @Input() type: 'one-line' | 'two-line' | 'three-line' = 'one-line';
  @Input() size: 'standard' | 'compact' = 'compact';
  @Input() leadingType: 'icon' | 'avatar' | 'thumbnail' | 'switch' = 'thumbnail';
  @Input() trailingType: 'icon' | 'badge' | 'switch' = 'icon';
  @Input() selected = false;
  @Input() initial = '?';
  @Input() src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';

  // Props de texto
  @Input() overline = '';
  @Input() title = 'List Item';
  @Input() text = 'Text';

  private ref?: any;

  constructor(private loader: RemoteLoaderService) {}

  async ngOnChanges(_: SimpleChanges) {
    if (!this.ref) {
      const mod = await this.loader.loadByName({
        remoteName: 'mef-ui',    // mismo remoteName que otros wrappers
        exposedModule: './List',   // expuesto en federation.config.js
      });

      const Cmp = mod.ListComponent; // export real del remoto
      this.ref = this.vc.createComponent(Cmp);
    }

    applyInputs(this.ref, {
      type: this.type,
      size: this.size,
      leadingType: this.leadingType,
      trailingType: this.trailingType,
      selected: this.selected,
      initial: this.initial,
      src: this.src,
      overline: this.overline,
      title: this.title,
      text: this.text,
    });
  }
}
