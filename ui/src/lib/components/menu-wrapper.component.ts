import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { RemoteLoaderService } from '../config/remote-loader.service';
import { MenuItem, MenuChangeEvent } from '../interfaces/menu.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mef-menu',
  standalone: true,
  template: `<ng-container #vc></ng-container>`,
})
export class MefMenuRemoteComponent implements OnChanges, OnDestroy {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

  // Inputs espejo del remoto
  @Input() items: MenuItem[] = [];
  @Input() density: 'standard' | 'compact' = 'standard';
  @Input() size: 'standard' | 'small' = 'standard';
  @Input() leading: 'none' | 'icon' | 'radio-button' | 'checkbox' = 'icon';
  @Input() trailing: 'none' | 'icon' = 'none';

  // Output reenviado
  @Output() itemChange = new EventEmitter<MenuChangeEvent>();

  private ref?: ComponentRef<any>;
  private sub?: Subscription;

  constructor(private loader: RemoteLoaderService) {}

  async ngOnChanges() {
    // Crear el componente remoto solo una vez
    if (!this.ref) {
      const mod = await this.loader.loadByName({
        remoteName: 'mef-ui',
        exposedModule: './Menu',
      });
      const Cmp = mod.MenuComponent;
      this.ref = this.vc.createComponent(Cmp);

      // Reemitir output del remoto
      const inst = this.ref.instance as any;
      if (inst?.itemChange?.subscribe) {
        this.sub = inst.itemChange.subscribe((ev: MenuChangeEvent) => this.itemChange.emit(ev));
      }
    }

    // Pasar inputs al remoto (con coalescencia mínima)
    this.ref!.setInput('items', this.items ?? []);
    this.ref!.setInput('density', this.density ?? 'standard');
    this.ref!.setInput('size', this.size ?? (this.density === 'compact' ? 'small' : 'standard'));
    this.ref!.setInput('leading', this.leading ?? 'icon');
    this.ref!.setInput('trailing', this.trailing ?? 'none');

    // Si el remoto es OnPush, esto ayuda:
    this.ref!.changeDetectorRef.markForCheck?.();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.ref?.destroy();
    this.ref = undefined;
  }
}
