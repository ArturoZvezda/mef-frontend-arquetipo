# 🚀 Quick Start Guide: MEF UI Integration

## Overview
This guide shows you how to run both projects and see the MEF UI components working in the arquetipo.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start MEF UI Design System
```bash
# Terminal 1
cd C:\dev\integracion\mef-design-system-master
npm run ng -- serve mef-ui
```
**Wait for:** `✔ Browser application bundle generation complete.`
**Running on:** http://localhost:4202

### Step 2: Start Arquetipo Host
```bash
# Terminal 2
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx serve host
```
**Running on:** http://localhost:4200

### Step 3: View Integration Demo
Open browser: **http://localhost:4200/mef-ui-demo**

---

## 🎯 What You'll See

The demo page includes:
- ✅ **6 Button variants** (filled, outlined, text, disabled, small, icon)
- ✅ **4 Alert types** (success, info, warning, error)
- ✅ **4 TextField examples** (standard, email, password, disabled)
- ✅ **Architecture documentation**
- ✅ **Event logging** for interactions

---

## 📂 Key Files Created

### In Arquetipo (`mef-frontend-arquetipo/`)
```
shared/src/lib/services/
  └── mef-ui-loader.service.ts          # Loads remote components

ui/src/lib/components/
  ├── mef-button-wrapper.component.ts   # Button wrapper
  ├── mef-alert-wrapper.component.ts    # Alert wrapper
  └── mef-text-field-wrapper.component.ts # TextField wrapper

host/src/app/components/mef-ui-demo/
  └── mef-ui-demo.component.ts          # Demo page

host/public/
  └── federation.manifest.json          # Remote config (updated)

host/src/app/
  └── app.routes.ts                     # Routes (added /mef-ui-demo)
```

### In Design System (`mef-design-system-master/`)
```
package.json                            # Updated to Angular 20
angular.json                            # Port changed to 4202
```

---

## 🔧 Using Components in Your App

### Example 1: Button
```typescript
import { MefButtonWrapperComponent } from '@mef-frontend-arquetipo/ui';

@Component({
  imports: [MefButtonWrapperComponent],
  template: `
    <mef-button-wrapper
      variant="filled"
      textButton="Save"
      (onClick)="save()">
    </mef-button-wrapper>
  `
})
```

### Example 2: Alert
```typescript
import { MefAlertWrapperComponent } from '@mef-frontend-arquetipo/ui';

@Component({
  imports: [MefAlertWrapperComponent],
  template: `
    <mef-alert-wrapper
      type="success"
      title="Saved!"
      message="Your changes were saved successfully.">
    </mef-alert-wrapper>
  `
})
```

### Example 3: TextField
```typescript
import { MefTextFieldWrapperComponent } from '@mef-frontend-arquetipo/ui';

@Component({
  imports: [MefTextFieldWrapperComponent],
  template: `
    <mef-text-field-wrapper
      label="Email"
      type="email"
      placeholder="user@example.com"
      (valueChange)="onEmailChange($event)">
    </mef-text-field-wrapper>
  `
})
```

---

## 📋 Available Components (17+)

| Component | Wrapper Status | How to Load |
|-----------|---------------|-------------|
| Button | ✅ Implemented | `MefButtonWrapperComponent` |
| Alert | ✅ Implemented | `MefAlertWrapperComponent` |
| TextField | ✅ Implemented | `MefTextFieldWrapperComponent` |
| Checkbox | ⚠️ Service ready | `mefUiLoader.loadCheckbox()` |
| Switch | ⚠️ Service ready | `mefUiLoader.loadSwitch()` |
| TextArea | ⚠️ Service ready | `mefUiLoader.loadTextArea()` |
| DatePicker | ⚠️ Service ready | `mefUiLoader.loadDatePicker()` |
| Radio | ⚠️ Service ready | `mefUiLoader.loadRadio()` |
| Menu | ⚠️ Service ready | `mefUiLoader.loadMenu()` |
| Breadcrumb | ⚠️ Service ready | `mefUiLoader.loadBreadcrumb()` |
| List | ⚠️ Service ready | `mefUiLoader.loadList()` |
| Badge | ⚠️ Service ready | `mefUiLoader.loadBadge()` |
| Accordion | ⚠️ Service ready | `mefUiLoader.loadAccordion()` |
| Divider | ⚠️ Service ready | `mefUiLoader.loadDivider()` |
| Modal | ⚠️ Service ready | `mefUiLoader.loadModal()` |
| Tag* (5 types) | ⚠️ Service ready | `mefUiLoader.loadTag*()` |

**Note:** Components marked ⚠️ can be loaded via MefUiLoaderService. Create wrappers following the pattern in existing wrapper components.

---

## 🐛 Troubleshooting

### Problem: Port already in use
**Solution:**
```bash
# Kill process on port 4202 (mef-ui)
npx kill-port 4202

# Kill process on port 4200 (host)
npx kill-port 4200
```

### Problem: "Cannot find module"
**Solution:**
```bash
# Rebuild shared library
cd C:\dev\integracion\mef-frontend-arquetipo
npx nx build shared

# Rebuild ui library
npx nx build ui
```

### Problem: Components not loading
**Solution:**
1. Check mef-ui is running on port 4202
2. Check browser console for errors
3. Verify `federation.manifest.json` has correct URL
4. Clear browser cache and reload

### Problem: Style warnings during build
**Solution:** These are non-blocking. To suppress:
```json
// angular.json
"budgets": [
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kB"
  }
]
```

---

## 📊 Port Assignments

| Service | Port | URL |
|---------|------|-----|
| **mef-ui** (Design System) | 4202 | http://localhost:4202 |
| **host** (Arquetipo Shell) | 4200 | http://localhost:4200 |
| **catalog** (Remote MFE) | 4201 | http://localhost:4201 |

---

## ✅ Verification Checklist

Before deploying to production:
- [ ] mef-ui builds without errors
- [ ] Arquetipo host builds without errors
- [ ] All wrapper components load successfully
- [ ] No console errors when viewing /mef-ui-demo
- [ ] Components respond to user interactions
- [ ] Event logging works correctly
- [ ] Federation manifest points to correct URLs

---

## 📖 More Information

- **Full Integration Report:** See `MEF_UI_INTEGRATION_REPORT.md`
- **Architecture Details:** Check report's "Architecture Overview" section
- **Component Props:** See mef-ui README in design system project

---

## 🎓 Next Steps

1. **Create more wrappers** for additional components (Checkbox, Switch, etc.)
2. **Add to your pages** using the examples above
3. **Customize styling** via component inputs
4. **Add tests** for wrapper components
5. **Document** component usage for your team

---

**Questions?** Check the full integration report or review the demo component code.

**Happy coding!** 🚀
