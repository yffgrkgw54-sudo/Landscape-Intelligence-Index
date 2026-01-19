# CLAUDE.md - AI Assistant Guide

> This document provides context for AI assistants working with the Landscape Intelligence Network codebase.

## Project Overview

**Landscape Intelligence Network** is an interactive web visualization mapping 4.5 billion years of landscape intelligence—from deep time geological processes through Indigenous epistemologies to contemporary Earth system science.

- **Creator**: Rose Borthwick, Harvard Graduate School of Design
- **Framework**: Part of "Design Pedagogies for the Planetary Student"
- **Current Status**: 327 coded entries with complete codification system

## Repository Structure

```
Landscape-Intelligence-Index/
├── index.html       # Landing page with project overview
├── network.html     # Main visualization interface (primary app)
├── about.html       # Codification system documentation
├── app.js           # D3.js visualization logic (~950 lines)
├── data.js          # Dataset with 327 entries (~6600 lines)
├── styles.css       # Design system with CSS variables (~980 lines)
└── README.md        # Project documentation
```

**Total**: ~10,000 lines of code in a flat structure (no subdirectories).

## Tech Stack

| Technology | Purpose | Details |
|------------|---------|---------|
| **Vanilla JavaScript (ES6+)** | Application logic | No framework, browser-native |
| **D3.js v7** | Visualization | Force-directed graphs, loaded via CDN |
| **CSS Custom Properties** | Theming | 24+ CSS variables for Cyanometer palette |
| **Google Fonts** | Typography | EB Garamond (serif), JetBrains Mono (mono) |

**No build process** - Files are served directly. No npm, webpack, or bundler.

## Quick Commands

```bash
# Local development - simply open in browser
open index.html

# Or use a local server
python -m http.server 8000

# Then visit http://localhost:8000
```

## Key Files

### `app.js` - Application Logic

Main entry point containing:
- **State variables**: `currentView`, `selectedNode`, `filters`, `simulation`
- **Initialization**: `initVisualization()`, `initFilters()`, `initEventListeners()`
- **Views**: `switchView()` toggles between network/timeline/radial
- **D3 visualization**: Force simulation with collision detection
- **Filtering**: Multi-criteria filtering via `applyFilters()`
- **Export**: `exportData()` generates CSV

Key sections (marked with `// ===== SECTION =====` comments):
- INITIALIZATION
- VISUALIZATION (D3 network rendering)
- TIMELINE VIEW
- RADIAL VIEW
- FILTERING
- EVENT HANDLERS

### `data.js` - Dataset

Contains configuration objects and 327 entries:

**Configuration Objects:**
```javascript
CATEGORIES        // 9 thematic categories (Cyanometer spectrum)
SOURCES           // 3 data sources (LI, JACO, TA)
DISCIPLINES       // 10 academic disciplines
SPHERE_INTERFACES // 19 Earth system couplings
ELEMENT_FUNCTIONS // 27 material/energy flows
INDETERMINACY_POSITIONS // 5-point coherence scale
TEMPORAL_PHASES   // 5 system lifecycle stages
FIVE_CRITERIA     // 5 evaluation metrics
```

**Entry Structure:**
```javascript
{
    id: number,
    year: string,              // Human-readable (e.g., "4.5 billion years ago")
    sortKey: number,           // Numeric for ordering (e.g., -4500000000)
    location: string,
    title: string,
    description: string,
    keywords: string[],
    citation: string,
    category: string,          // DT, IE, ES, CS, LA, CM, EG, CT, AC
    source: string,            // LI, JACO, TA
    discipline: string,        // GEOL, ECOL, INDIG, etc.
    sphereInterface: string,   // e.g., "BIO-GEO"
    elementFunction: string,   // e.g., "CARBON-CYCLING"
    indeterminacy: string,     // CLEAR-COHERENT to CLEAR-DISSIPATION
    fiveCriteria: {
        closure: 1-5,
        metabolic: 1-5,
        timescale: 1-5,
        pattern: 1-5,
        recognition: 1-5
    },
    temporalPhase: string,     // PRE-EXTRACTION, etc.
    isAnchor: boolean,         // 82 foundational knowledge nodes
    connections: number[]      // Related entry IDs
}
```

### `styles.css` - Design System

**CSS Custom Properties (key variables):**
```css
/* Background */
--bg-primary: #EDF0E0;     /* Warm cream (CMYK 7,6,12,0) */

/* Cyanometer Spectrum (9 shades for categories) */
--cyan-deep: #003153;      /* Deep Time */
--cyan-dark: #1a4780;      /* Indigenous Epistemologies */
--cyan-medium-dark: #2e5984;
--cyan-medium: #4a7c9b;
--cyan-medium-light: #6b9eb8;
--cyan-light: #8fb9cf;
--cyan-lighter: #b3d4e5;
--cyan-pale: #d4e8f5;
--cyan-palest: #e8f4fc;    /* Ancient & Classical */

/* Fonts */
--font-display: 'EB Garamond', serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Component Classes:**
- `.app-container` - Main flex layout
- `.sidebar` - 320px fixed left panel
- `.viz-container` - D3 canvas area
- `.detail-panel` - Entry info sidebar (right)
- `.toolbar` - Connection/color toggles
- `.legend` - Category reference
- `.modal` - Add entry overlay

## Codification System

### 9 Thematic Categories (Cyanometer Spectrum)

| Code | Category | Color | Count |
|------|----------|-------|-------|
| DT | Deep Time | #003153 | 14 |
| IE | Indigenous Epistemologies | #1a4780 | 53 |
| ES | Earth System Science | #2e5984 | 63 |
| CS | Cybernetics & Systems | #4a7c9b | 19 |
| LA | Landscape Architecture | #6b9eb8 | 19 |
| CM | Critical Materials & Extraction | #8fb9cf | 67 |
| EG | Environmental Governance | #b3d4e5 | 10 |
| CT | Contemporary Theory | #d4e8f5 | 63 |
| AC | Ancient & Classical | #e8f4fc | 19 |

### Indeterminacy Scale (5-point)

1. CLEAR-DISSIPATION (1) - System collapse
2. SEARCH-DISSIPATING (2) - Declining coherence
3. PHASE-TRANSITION (3) - Critical threshold
4. SEARCH-PROMISING (4) - Emerging coherence
5. CLEAR-COHERENT (5) - Stable system

### Sphere Interfaces (19 types)

Earth system component couplings: LITHO-GEO, BIO-GEO, BIO-ATMO, TECHNO-HYDRO, etc.

### Temporal Phases (5)

PRE-EXTRACTION → ACTIVE-MOBILIZATION → POST-DISPERSAL → RECOVERY-ATTEMPT → SYSTEM-TRANSITION

## Code Conventions

### JavaScript Patterns

- **No modules**: All code is global, loaded via `<script>` tags
- **Section comments**: Use `// ===== SECTION NAME =====` for organization
- **State management**: Global variables at top of app.js
- **Event handling**: DOM event listeners via querySelector
- **D3 patterns**: Selection-based updates with `.data()` and `.join()`

### CSS Patterns

- **CSS custom properties** for all colors and fonts
- **BEM-like naming**: `.sidebar-section`, `.checkbox-item`
- **Flexbox/Grid** for layouts
- **Transitions**: `transition: all 0.2s` for interactive elements

### HTML Patterns

- **Semantic elements**: `<aside>`, `<main>`, `<nav>`
- **Data attributes** for JS hooks: `data-view`, `data-filter`, `data-connection`
- **Modal pattern**: `.modal-overlay` with backdrop

## Common Tasks

### Adding a New Entry

1. Add entry object to `entries` array in `data.js`
2. Assign unique `id` (next available number)
3. Set `sortKey` for temporal ordering (negative for BCE)
4. Choose appropriate `category`, `sphereInterface`, `elementFunction`
5. Set `isAnchor: true` if it's a foundational knowledge system
6. Add related entry IDs to `connections` array

### Adding a New Filter

1. Add filter configuration to `data.js` (e.g., new object in DISCIPLINES)
2. Update `filters` object in `app.js` to include new Set
3. Add checkbox generation in `initFilters()`
4. Update `applyFilters()` to check new criteria
5. Add UI section in `network.html` for filter checkboxes

### Modifying the Color Scheme

1. Update CSS custom properties in `styles.css`
2. Update corresponding values in `CATEGORIES` object in `data.js`
3. Verify D3 visualization picks up new colors via `getNodeColor()`

### Adding a New Visualization View

1. Add view container in `network.html`
2. Add view option to toolbar with `data-view` attribute
3. Update `switchView()` in `app.js` to handle new view
4. Implement render function (e.g., `renderNewView()`)
5. Add styles for new view in `styles.css`

## Architecture Notes

### Data Flow

```
data.js (entries) → app.js (filtering) → D3.js (visualization) → DOM
                         ↑
                    User interactions (filters, search, selection)
```

### No Build Process

- Files served directly as-is
- D3.js loaded from CDN: `https://d3js.org/d3.v7.min.js`
- Fonts loaded from Google Fonts CDN
- No minification, bundling, or transpilation

### Performance Considerations

- 327 nodes rendered client-side
- Force simulation runs on every filter change
- SVG-based rendering (can be intensive with many nodes)
- No lazy loading or pagination

## Testing

**No automated testing infrastructure.**

Testing is manual/visual:
- Verify visualization renders correctly
- Check filter combinations work
- Test node selection and detail panel
- Verify CSV export contains correct data

## Deployment

### GitHub Pages (Recommended)

1. Push all files to GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main → / (root)
4. Site available at `https://[username].github.io/[repo-name]`

### Any Static Host

Upload files maintaining flat structure. No build step required.

## Important Gotchas

1. **Global scope**: All JavaScript is global - be careful with variable names
2. **No hot reload**: Refresh browser manually after changes
3. **D3 version**: Uses D3.js v7 - API differs from earlier versions
4. **sortKey values**: Use negative numbers for BCE dates (e.g., -4500000000 for 4.5 billion years ago)
5. **Color consistency**: Colors must match between `data.js` config objects and `styles.css` variables
6. **Entry IDs**: Must be unique integers; connections reference these IDs

## File Modification Guidelines

When modifying this codebase:

1. **Preserve flat structure**: No need to create subdirectories
2. **Keep inline styles minimal**: Use CSS classes and custom properties
3. **Maintain data consistency**: Entry structure must match expected schema
4. **Test visualizations**: Check all three views (network, timeline, radial) after changes
5. **Update README.md**: If adding significant features or changing structure
