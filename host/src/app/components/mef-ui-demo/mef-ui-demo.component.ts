import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  MefAlertWrapperComponent,
  MefButtonWrapperComponent,
  MefTextFieldWrapperComponent,
} from '@mef-frontend-arquetipo/ui';

/**
 * Demo component showcasing MEF UI Design System integration
 *
 * This component demonstrates the integration of mef-ui components
 * into the hexagonal architecture using the wrapper pattern.
 */
@Component({
  selector: 'app-mef-ui-demo',
  standalone: true,
  imports: [
    CommonModule,
    MefButtonWrapperComponent,
    MefAlertWrapperComponent,
    MefTextFieldWrapperComponent,
  ],
  template: `
    <div class="mef-ui-demo-container">
      <!-- Header -->
      <div class="demo-header">
        <h1>🎨 MEF UI Design System Integration</h1>
        <p class="subtitle">
          Components from mef-ui microfrontend (port 4202) integrated into the
          hexagonal architecture
        </p>
        <div class="integration-info">
          <span class="info-badge">📦 Remote Federation</span>
          <span class="info-badge">⚡ Angular 20</span>
          <span class="info-badge">🏗️ Hexagonal Architecture</span>
        </div>
      </div>

      <!-- Button Components Section -->
      <section class="demo-section">
        <h2>🔘 Buttons</h2>
        <p class="section-description">
          Button components loaded from mef-ui via Native Federation
        </p>

        <div class="component-grid">
          <div class="component-demo">
            <h3>Filled Variant</h3>
            <mef-button-wrapper
              variant="filled"
              textButton="Filled"
              (onClick)="handleButtonClick('Filled')"
            >
            </mef-button-wrapper>
          </div>

          <div class="component-demo">
            <h3>Outlined Variant</h3>
            <mef-button-wrapper
              variant="outlined"
              textButton="Outlined"
              (onClick)="handleButtonClick('Outlined')"
            >
            </mef-button-wrapper>
          </div>

          <div class="component-demo">
            <h3>Text Variant</h3>
            <mef-button-wrapper
              variant="text"
              textButton="Text"
              (onClick)="handleButtonClick('Text')"
            >
            </mef-button-wrapper>
          </div>

          <div class="component-demo">
            <h3>Disabled State</h3>
            <mef-button-wrapper
              variant="filled"
              textButton="Disabled Button"
              [disabled]="true"
            >
            </mef-button-wrapper>
          </div>

          <div class="component-demo">
            <h3>Small Size</h3>
            <mef-button-wrapper
              variant="filled"
              size="small"
              textButton="Small"
              (onClick)="handleButtonClick('Small')"
            >
            </mef-button-wrapper>
          </div>

          <div class="component-demo">
            <h3>With Icon</h3>
            <mef-button-wrapper
              variant="filled"
              textButton="Icon"
              [leadingIcon]="true"
              icon="add"
              (onClick)="handleButtonClick('Icon')"
            >
            </mef-button-wrapper>
          </div>
        </div>
      </section>

      <!-- Alert Components Section -->
      <section class="demo-section">
        <h2>📢 Alerts</h2>
        <p class="section-description">
          Alert components for feedback and notifications
        </p>

        <div class="alerts-stack">
          <mef-alert-wrapper
            type="success"
            title="Success!"
            message="Your operation completed successfully."
          >
          </mef-alert-wrapper>

          <mef-alert-wrapper
            type="info"
            title="Information"
            message="This is an informational message from MEF UI."
          >
          </mef-alert-wrapper>

          <mef-alert-wrapper
            type="warning"
            title="Warning"
            message="Please review this warning message carefully."
          >
          </mef-alert-wrapper>

          <mef-alert-wrapper
            type="error"
            title="Error"
            message="An error occurred. Please try again."
          >
          </mef-alert-wrapper>
        </div>
      </section>

      <!-- Text Field Components Section -->
      <section class="demo-section">
        <h2>📝 Text Fields</h2>
        <p class="section-description">
          Input field components with validation
        </p>

        <div class="form-grid">
          <div class="form-field-demo">
            <h3>Standard Text Field</h3>
            <mef-text-field-wrapper
              label="Name"
              placeholder="Enter your name"
              (valueChange)="handleTextChange('name', $event)"
            >
            </mef-text-field-wrapper>
          </div>

          <div class="form-field-demo">
            <h3>Email Field</h3>
            <mef-text-field-wrapper
              label="Email"
              placeholder="user@example.com"
              type="email"
              [required]="true"
              (valueChange)="handleTextChange('email', $event)"
            >
            </mef-text-field-wrapper>
          </div>

          <div class="form-field-demo">
            <h3>Password Field</h3>
            <mef-text-field-wrapper
              label="Password"
              placeholder="Enter password"
              type="password"
              [required]="true"
              (valueChange)="handleTextChange('password', $event)"
            >
            </mef-text-field-wrapper>
          </div>

          <div class="form-field-demo">
            <h3>Disabled Field</h3>
            <mef-text-field-wrapper
              label="Disabled"
              placeholder="This field is disabled"
              [disabled]="true"
              value="Cannot edit"
            >
            </mef-text-field-wrapper>
          </div>
        </div>
      </section>

      <!-- Integration Details -->
      <section class="demo-section integration-details">
        <h2>🔧 Integration Architecture</h2>

        <div class="architecture-info">
          <div class="info-card">
            <h3>📂 Layer: UI Library</h3>
            <p>Wrapper components in <code>@mef-frontend-arquetipo/ui</code></p>
            <ul>
              <li>MefButtonWrapperComponent</li>
              <li>MefAlertWrapperComponent</li>
              <li>MefTextFieldWrapperComponent</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>⚙️ Layer: Shared Services</h3>
            <p>
              Remote module loader in
              <code>@mef-frontend-arquetipo/shared</code>
            </p>
            <ul>
              <li>MefUiLoaderService</li>
              <li>Dynamic component loading</li>
              <li>Federation configuration</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>🌐 Remote Microfrontend</h3>
            <p>MEF UI running on port 4202</p>
            <ul>
              <li>17+ exposed components</li>
              <li>Angular 20 compatible</li>
              <li>Native Federation v20</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>🎯 Benefits</h3>
            <ul>
              <li>✅ Clean separation of concerns</li>
              <li>✅ Hexagonal architecture maintained</li>
              <li>✅ Independent deployment</li>
              <li>✅ Type-safe integration</li>
              <li>✅ Version isolation</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Event Log -->
      @if (eventLog.length > 0) {
      <section class="demo-section">
        <h2>📋 Event Log</h2>
        <div class="event-log">
          @for (event of eventLog; track event.timestamp) {
          <div class="event-entry">
            <span class="event-time">{{
              event.timestamp | date : 'HH:mm:ss'
            }}</span>
            <span class="event-type">{{ event.type }}</span>
            <span class="event-detail">{{ event.detail }}</span>
          </div>
          }
        </div>
        <button class="clear-log-btn" (click)="clearLog()">🗑️ Clear Log</button>
      </section>
      }
    </div>
  `,
  styles: [
    `
      .mef-ui-demo-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
        background: #f9fafb;
        min-height: 100vh;
      }

      .demo-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 3rem 2rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
      }

      .demo-header h1 {
        margin: 0 0 1rem 0;
        font-size: 3rem;
        font-weight: 700;
      }

      .subtitle {
        margin: 0 0 1.5rem 0;
        font-size: 1.125rem;
        opacity: 0.95;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .integration-info {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .info-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
        backdrop-filter: blur(10px);
      }

      .demo-section {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
      }

      .demo-section h2 {
        margin: 0 0 0.5rem 0;
        color: #1f2937;
        font-size: 1.75rem;
      }

      .section-description {
        margin: 0 0 1.5rem 0;
        color: #6b7280;
      }

      .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .component-demo {
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
      }

      .component-demo h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #374151;
        font-weight: 600;
      }

      .alerts-stack {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .form-field-demo {
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
      }

      .form-field-demo h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #374151;
        font-weight: 600;
      }

      .architecture-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }

      .info-card {
        padding: 1.5rem;
        background: linear-gradient(135deg, #f9fafb, #ffffff);
        border-radius: 0.75rem;
        border: 2px solid #e5e7eb;
      }

      .info-card h3 {
        margin: 0 0 0.75rem 0;
        color: #6366f1;
        font-size: 1.125rem;
      }

      .info-card p {
        margin: 0 0 1rem 0;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .info-card code {
        background: #1f2937;
        color: #10b981;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
      }

      .info-card ul {
        margin: 0;
        padding-left: 1.25rem;
        color: #374151;
      }

      .info-card li {
        margin: 0.5rem 0;
        font-size: 0.875rem;
      }

      .event-log {
        max-height: 300px;
        overflow-y: auto;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1rem;
      }

      .event-entry {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
        font-size: 0.875rem;
      }

      .event-entry:last-child {
        border-bottom: none;
      }

      .event-time {
        color: #6b7280;
        font-family: 'Courier New', monospace;
      }

      .event-type {
        font-weight: 600;
        color: #6366f1;
      }

      .event-detail {
        color: #374151;
      }

      .clear-log-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
      }

      .clear-log-btn:hover {
        background: #dc2626;
      }

      @media (max-width: 768px) {
        .mef-ui-demo-container {
          padding: 1rem;
        }

        .demo-header h1 {
          font-size: 2rem;
        }

        .component-grid,
        .form-grid,
        .architecture-info {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MefUiDemoComponent {
  eventLog: Array<{ timestamp: Date; type: string; detail: string }> = [];

  handleButtonClick(variant: string) {
    this.logEvent('Button Click', `${variant} button clicked`);
  }

  handleTextChange(field: string, value: string) {
    this.logEvent('Text Input', `${field}: ${value}`);
  }

  logEvent(type: string, detail: string) {
    this.eventLog.unshift({
      timestamp: new Date(),
      type,
      detail,
    });

    // Keep only last 20 events
    if (this.eventLog.length > 20) {
      this.eventLog = this.eventLog.slice(0, 20);
    }
  }

  clearLog() {
    this.eventLog = [];
  }
}
