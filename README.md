# Landscape Intelligence Network

An interactive web visualization mapping 4.5 billion years of landscape intelligence—from deep time geological processes through Indigenous epistemologies to contemporary Earth system science.

## Features

- **Network View**: Force-directed graph showing connections between entries
- **Radial View**: Circular arrangement by thematic category
- **Timeline View**: Chronological list with logarithmic temporal scaling
- **Multiple Filtering Options**:
  - Thematic Category (9 categories on Cyanometer spectrum)
  - Source ([LI], [JACO], [TA])
  - Indeterminacy Position (5-point scale)
  - Temporal Phase (5 phases)
- **Connection Type Toggles**: Thematic, Citation, Sphere Interface, Element-Function, Indeterminacy
- **Color Modes**: By Category or Temporal Depth
- **Add New Entries**: Built-in form for expanding the dataset
- **Export**: CSV export functionality

## Files

```
landscape-intelligence-network/
├── index.html       # Landing page
├── network.html     # Main visualization interface
├── about.html       # Codification system documentation
├── styles.css       # Cyanometer palette on CMYK 7,6,12,0 background
├── data.js          # 51 coded entries with full codification
├── app.js           # D3.js visualization logic
└── README.md
```

## Colour Palette

### Background
- CMYK 7,6,12,0 → #EDF0E0 (warm cream)

### Cyanometer Spectrum (9 Thematic Categories)
| Code | Category | Hex |
|------|----------|-----|
| DT | Deep Time | #003153 |
| IE | Indigenous Epistemologies | #1a4780 |
| ES | Earth System Science | #2e5984 |
| CS | Cybernetics & Systems | #4a7c9b |
| LA | Landscape Architecture | #6b9eb8 |
| CM | Critical Materials & Extraction | #8fb9cf |
| EG | Environmental Governance | #b3d4e5 |
| CT | Contemporary Theory | #d4e8f5 |
| AC | Ancient & Classical | #e8f4fc |

## Codification System

### Sphere Interfaces
Coupling between Earth system components (e.g., BIO-GEO, TECHNO-HYDRO, LITHO-TECHNO)

### Element-Function Codes
Primary element/material flow + function (e.g., CARBON-CYCLING, INFORMATION-MEMORY, WATER-CYCLING)

### Indeterminacy Positions
5-point scale from CLEAR-COHERENT (5) to CLEAR-DISSIPATION (1)

### Five Criteria
Scores (1-5) for: Closure, Metabolic Efficiency, Timescale-Bridging, Pattern-Persistence, Self-Recognition

### Temporal Phases
PRE-EXTRACTION, ACTIVE-MOBILIZATION, POST-DISPERSAL, RECOVERY-ATTEMPT, SYSTEM-TRANSITION

### Sources
- [LI] Landscape Intelligence Timeline
- [JACO] Jaco Challenge Citations
- [TA] Territorial Agency / Palmesino Lectures

## Deployment

### GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all files maintaining folder structure
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main → / (root)
5. Your site will be live at `https://[username].github.io/[repo-name]`

### Local Preview

Simply open `index.html` in a web browser. No build process required.

## Data Structure

Each entry in `data.js` includes:
- id, year, sortKey (for temporal ordering)
- location, title, description, keywords, citation
- category (DT, IE, ES, CS, LA, CM, EG, CT, AC)
- source (LI, JACO, TA)
- sphereInterface, elementFunction, indeterminacy
- fiveCriteria: { closure, metabolic, timescale, pattern, recognition }
- temporalPhase
- isAnchor (boolean for theoretical foundation nodes)
- connections (array of related entry IDs)

## Current Status

- **51 entries** fully coded
- **~297 entries** remaining to be coded from original timelines

---

Developed by Rose Borthwick | Harvard Graduate School of Design
Part of the Design Pedagogies for the Planetary Student framework
