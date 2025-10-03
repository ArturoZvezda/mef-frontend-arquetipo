import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

/**
 * Service to load MEF UI components dynamically from the remote microfrontend
 *
 * This service provides methods to load individual components from the mef-ui
 * design system running on port 4202. Each component is loaded lazily when needed.
 *
 * @example
 * ```typescript
 * const ButtonComponent = await this.mefUiLoader.loadButton();
 * this.viewContainerRef.createComponent(ButtonComponent);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MefUiLoaderService {

  private readonly remoteName = 'mef-ui';

  /**
   * Load a component from the mef-ui remote
   */
  private async loadComponent(exposedModule: string): Promise<any> {
    try {
      const module = await loadRemoteModule({
        remoteName: this.remoteName,
        exposedModule
      });
      return module;
    } catch (error) {
      console.error(`Failed to load ${exposedModule} from ${this.remoteName}:`, error);
      throw error;
    }
  }

  // ==================== FORM COMPONENTS ====================

  async loadButton() {
    return await this.loadComponent('./Button');
  }

  async loadCheckbox() {
    return await this.loadComponent('./CheckboxLabel');
  }

  async loadSwitch() {
    return await this.loadComponent('./SwitchLabel');
  }

  async loadTextField() {
    return await this.loadComponent('./TextField');
  }

  async loadTextArea() {
    return await this.loadComponent('./TextArea');
  }

  async loadDatePicker() {
    return await this.loadComponent('./DatePicker');
  }

  async loadRadio() {
    return await this.loadComponent('./RadioLabel');
  }

  // ==================== NAVIGATION COMPONENTS ====================

  async loadMenu() {
    return await this.loadComponent('./Menu');
  }

  async loadBreadcrumb() {
    return await this.loadComponent('./Breadcrumb');
  }

  async loadList() {
    return await this.loadComponent('./List');
  }

  // ==================== FEEDBACK COMPONENTS ====================

  async loadAlert() {
    return await this.loadComponent('./Alert');
  }

  async loadBadge() {
    return await this.loadComponent('./Badge');
  }

  // ==================== LAYOUT COMPONENTS ====================

  async loadAccordion() {
    return await this.loadComponent('./Accordion');
  }

  async loadDivider() {
    return await this.loadComponent('./Divider');
  }

  async loadModal() {
    return await this.loadComponent('./Modal');
  }

  // ==================== TAG COMPONENTS ====================

  async loadTagInput() {
    return await this.loadComponent('./TagInput');
  }

  async loadTagFlow() {
    return await this.loadComponent('./TagFlow');
  }

  async loadTagFile() {
    return await this.loadComponent('./TagFile');
  }

  async loadTagStatus() {
    return await this.loadComponent('./TagStatus');
  }

  async loadTextFieldTag() {
    return await this.loadComponent('./TextFieldTag');
  }

  // ==================== PRIMITIVES ====================

  async loadModalBlockThumbnail() {
    return await this.loadComponent('./ModalBlockThumbnail');
  }

  // ==================== FOUNDATIONS ====================

  async loadBrand() {
    return await this.loadComponent('./Brand');
  }
}
