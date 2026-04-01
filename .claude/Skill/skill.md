# 🎯 Frontend Skill Library (Next.js + MUI + JSON Mock Data)

## 🧠 Purpose

This skill library is optimized for:

* ✅ No backend (temporary)
* ✅ JSON-based mock data
* ✅ Material UI (MUI) for styling
* ✅ Next.js App Router

---

# 🟢 1. Skill: JSON Data Source Manager

### Description

Handles local JSON-based mock data for models until APIs are ready.

### Inputs

* JSON file (`models.json`)

### Outputs

* Parsed model data

### Steps / Logic

1. Create `/data/models.json`
2. Define schema:

   * id
   * name
   * description
   * price
   * rating
   * tags
3. Import JSON into components
4. Use as data source

### Tech Stack

Next.js, TypeScript

### Example Usage

```js
import models from "@/data/models.json";
```

### Edge Cases

* Missing fields
* Invalid JSON format

### Dependencies

* None

---

# 🟢 2. Skill: Material UI Theme Setup

### Description

Configures global MUI theme (colors, typography).

### Inputs

* theme config

### Outputs

* ThemeProvider wrapper

### Steps / Logic

1. Install MUI
2. Create `theme.ts`
3. Wrap app with `ThemeProvider`
4. Apply global styles

### Tech Stack

Material UI (MUI)

### Example Usage

Custom primary color

### Edge Cases

* Theme conflicts with Tailwind (avoid mixing heavily)

### Dependencies

* MUI Core

---

# 🟢 3. Skill: App Layout with MUI

### Description

Creates layout using MUI components (AppBar, Drawer, Container).

### Inputs

* layoutType

### Outputs

* Responsive layout

### Steps / Logic

1. Use `AppBar` for navbar
2. Use `Drawer` for sidebar
3. Use `Container` for content
4. Handle responsiveness

### Tech Stack

MUI

### Example Usage

Dashboard layout

### Edge Cases

* Mobile drawer toggle

### Dependencies

* Theme Setup

---

# 🟢 4. Skill: Model Card (MUI Version)

### Description

Displays AI model using MUI Card components.

### Inputs

* model object

### Outputs

* Styled card UI

### Steps / Logic

1. Use `Card`, `CardContent`, `CardActions`
2. Show:

   * Name
   * Description
   * Rating (MUI Rating)
   * Price
3. Add button (View / Chat)

### Tech Stack

MUI

### Example Usage

```jsx
<ModelCard model={model} />
```

### Edge Cases

* Long text overflow
* Missing rating

### Dependencies

* JSON Data

---

# 🟢 5. Skill: Marketplace Grid (MUI Grid)

### Description

Displays models using responsive grid.

### Inputs

* models[]

### Outputs

* Grid layout

### Steps / Logic

1. Use `Grid` container
2. Map models
3. Render ModelCard
4. Apply breakpoints

### Tech Stack

MUI Grid

### Example Usage

```jsx
<Grid container spacing={2}>
```

### Edge Cases

* Empty state
* Loading skeleton

### Dependencies

* Model Card

---

# 🟢 6. Skill: Search & Filter (Frontend Only)

### Description

Implements client-side search using JSON data.

### Inputs

* searchQuery
* filters

### Outputs

* Filtered models

### Steps / Logic

1. Store query in state
2. Filter JSON:

   * name.includes(query)
   * tags match
3. Update UI

### Tech Stack

React, MUI Inputs

### Example Usage

Search models

### Edge Cases

* No results
* Case sensitivity

### Dependencies

* JSON Data

---

# 🟢 7. Skill: Onboarding Flow UI (MUI Stepper)

### Description

Creates multi-step onboarding using MUI Stepper.

### Inputs

* steps[]
* answers

### Outputs

* userProfile

### Steps / Logic

1. Use `Stepper`, `Step`, `StepLabel`
2. Render questions
3. Capture answers
4. Move next/back

### Tech Stack

MUI Stepper, Zustand

### Example Usage

User onboarding wizard

### Edge Cases

* Skipped steps
* Invalid answers

### Dependencies

* State Management

---

# 🟢 8. Skill: Chat UI (MUI)

### Description

Builds chat interface using MUI components.

### Inputs

* messages[]

### Outputs

* Chat UI

### Steps / Logic

1. Use `Box`, `Paper`, `TextField`
2. Render messages
3. Handle input
4. Simulate response (mock)

### Tech Stack

MUI

### Example Usage

Chat with AI

### Edge Cases

* Long messages
* Scroll overflow

### Dependencies

* State

---

# 🟢 9. Skill: Modal System (MUI Dialog)

### Description

Displays model details using MUI Dialog.

### Inputs

* open
* model

### Outputs

* Modal UI

### Steps / Logic

1. Use `Dialog`
2. Render model details
3. Add actions

### Tech Stack

MUI Dialog

### Example Usage

Open model details

### Edge Cases

* Multiple dialogs

### Dependencies

* Model Card

---

# 🟢 10. Skill: Global State (Zustand)

### Description

Manages global state (onboarding, chat, filters).

### Inputs

* state updates

### Outputs

* shared state

### Steps / Logic

1. Create store
2. Define actions
3. Update state

### Tech Stack

Zustand

### Example Usage

Store user preferences

### Edge Cases

* Reset state

### Dependencies

* Components

---

# 🟢 11. Skill: Loading & Skeleton (MUI)

### Description

Handles loading UI using MUI Skeleton.

### Inputs

* loading state

### Outputs

* Skeleton UI

### Steps / Logic

1. Detect loading
2. Show Skeleton
3. Replace with content

### Tech Stack

MUI Skeleton

### Example Usage

While loading models

### Edge Cases

* Flashing UI

### Dependencies

* Data layer

---

# 🟢 12. Skill: Mock Chat Response Engine

### Description

Simulates AI responses until backend is ready.

### Inputs

* user message

### Outputs

* mock AI response

### Steps / Logic

1. Capture input
2. Match keywords
3. Return predefined response

### Tech Stack

JavaScript

### Example Usage

Fake AI chat

### Edge Cases

* Unknown queries

### Dependencies

* Chat UI

---

# 🚀 FINAL NOTE

This setup allows you to:

* ✅ Build full frontend WITHOUT backend
* ✅ Use real UI (MUI)
* ✅ Replace JSON with API later easily

👉 When API is ready:

* Replace JSON with API calls
* Replace mock chat with real LLM

---

🔥 This is the **fastest + cleanest way** to build your project right now.
