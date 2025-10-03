import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  forwardRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RemoteLoaderService } from '../config/remote-loader.service';
import { applyInputs } from '../config/apply-inputs.util';

@Component({
  selector: 'mef-text-field', // cámbialo a 'mef-text-field-remote' si choca con el local
  standalone: true,
  template: `<ng-container #vc></ng-container>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MefTextFieldRemoteComponent),
      multi: true,
    },
  ],
})
export class MefTextFieldRemoteComponent
  implements OnChanges, OnDestroy, ControlValueAccessor
{
  @ViewChild('vc', { read: ViewContainerRef, static: true })
  vc!: ViewContainerRef;

  // Props espejo del remoto
  @Input() label: string = 'Label text';
  @Input() placeholder: string = '';
  @Input() size: 'default' | 'compact' = 'default';
  @Input() state: 'default' | 'error' | 'success' = 'default';
  @Input() isDisabled: boolean = false;

  // Valor + two-way propio (opcional)
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  // Eventos útiles
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  private ref?: ComponentRef<any>;
  private subs: Subscription[] = [];

  // CVA hooks
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private loader: RemoteLoaderService) {}

  async ngOnChanges(_: SimpleChanges) {
    if (!this.ref) {
      const mod = await this.loader.loadByName({
        remoteName: 'mef-ui',          // ajusta si tu remoto usa otro nombre
        exposedModule: './TextField',  // debe coincidir con tu federation config
      });

      const Cmp = mod.TextFieldComponent; // export real del remoto
      this.ref = this.vc.createComponent(Cmp);

      // Reemitir outputs del remoto (si existen)
      const inst = this.ref.instance as any;
      if (inst?.valueChange?.subscribe) {
        this.subs.push(
          inst.valueChange.subscribe((v: string) => {
            // Propaga a quien use [(value)] y a Forms API
            this.value = v;
            this.valueChange.emit(v);
            this.onChange(v);
          })
        );
      }
      if (inst?.focus?.subscribe) {
        this.subs.push(inst.focus.subscribe(() => this.focus.emit()));
      }
      if (inst?.blur?.subscribe) {
        this.subs.push(
          inst.blur.subscribe(() => {
            this.onTouched();
            this.blur.emit();
          })
        );
      }
    }

    // Pasa inputs al remoto (incluye value)
    applyInputs(this.ref!, {
      label: this.label,
      placeholder: this.placeholder,
      size: this.size,
      state: this.state,
      isDisabled: this.isDisabled,
      value: this.value,
    });
  }

  // —— ControlValueAccessor ——
  writeValue(v: any): void {
    this.value = v ?? '';
    if (this.ref) {
      this.ref.setInput?.('value', this.value);
      this.ref.changeDetectorRef.markForCheck?.();
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.ref) {
      this.ref.setInput?.('isDisabled', isDisabled);
      this.ref.changeDetectorRef.markForCheck?.();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.ref?.destroy();
    this.ref = undefined;
  }
}
