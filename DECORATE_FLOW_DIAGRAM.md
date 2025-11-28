# How `decorate(block)` Works – Visual Schema

## 1. The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER PAGE LOADS                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  EDS Runtime (scripts.js / aem.js)                              │
│  Scans DOM for blocks:                                          │
│  document.querySelectorAll('.carousel')                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  Found: <div class="carousel">     │
        │  (Raw HTML from Google Doc)        │
        └────────────────────┬───────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  Import carousel.js                                │
        │  Call: export default function decorate(block)     │
        └────────────────────┬───────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  decorate(block) TRANSFORMS the HTML               │
        │                                                    │
        │  Input:  Raw <div> children (rows from Doc)        │
        │  Output: Full carousel with buttons, dots, logic   │
        └────────────────────┬───────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  Result: Interactive carousel on page              │
        │  - Slides with images & text                       │
        │  - Prev/Next buttons                               │
        │  - Dots for navigation                             │
        │  - Auto-rotate every 5 seconds                     │
        └────────────────────────────────────────────────────┘
```

---

## 2. What `decorate(block)` Does – Step by Step

```
INPUT: Raw HTML from Google Doc
┌──────────────────────────────────────────┐
│ <div class="carousel">                   │
│   <div>                                  │
│     <div><img src="slide1.jpg"></div>    │
│     <div><p>Slide 1 text</p></div>       │
│   </div>                                 │
│   <div>                                  │
│     <div><img src="slide2.jpg"></div>    │
│     <div><p>Slide 2 text</p></div>       │
│   </div>                                 │
│   <div>                                  │
│     <div><img src="slide3.jpg"></div>    │
│     <div><p>Slide 3 text</p></div>       │
│   </div>                                 │
│ </div>                                   │
└──────────────────────────────────────────┘
           │
           │ decorate(block) processes:
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 1: Read rows                        │
│ const rows = Array.from(                 │
│   block.querySelectorAll(':scope > div') │
│ );                                       │
│ → 3 rows found                           │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 2: Create structure                 │
│ - carousel-wrapper                       │
│ - carousel-container                     │
│ - carousel-slides                        │
│ - slideElements = []                     │
│ - slideIndex = 0                         │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 3: Loop rows → build slides         │
│ rows.forEach((row) => {                  │
│   - Extract image, heading, text         │
│   - Create <div class="carousel-slide">  │
│   - Add to slideElements[]                │
│   - Mark first as .active                │
│ })                                       │
│ → 3 slides created                       │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 4: Create controls                  │
│ - <button class="carousel-prev">         │
│ - <button class="carousel-next">         │
│ - <div class="carousel-dots">            │
│   - 3 dots (one per slide)               │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 5: Wire up behavior                 │
│ - prevBtn.addEventListener('click', ...) │
│ - nextBtn.addEventListener('click', ...) │
│ - dotElements.forEach(dot => {           │
│     dot.addEventListener('click', ...)   │
│   })                                     │
│ - setInterval(auto-advance, 5000)        │
│ - showSlide() helper function            │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 6: Replace original content         │
│ block.textContent = '';                  │
│ block.append(wrapper);                   │
└──────────────────────────────────────────┘
           │
           ▼
OUTPUT: Full interactive carousel
┌──────────────────────────────────────────────────────────┐
│ <div class="carousel">                                   │
│   <div class="carousel-wrapper">                         │
│     <button class="carousel-prev">‹</button>             │
│     <div class="carousel-container">                     │
│       <div class="carousel-slides">                      │
│         <div class="carousel-slide active">              │
│           <img class="carousel-image" ...>               │
│           <div class="carousel-content">                 │
│             <h3 class="carousel-title">...</h3>          │
│             <p class="carousel-text">...</p>             │
│           </div>                                         │
│         </div>                                           │
│         <div class="carousel-slide">...</div>            │
│         <div class="carousel-slide">...</div>            │
│       </div>                                             │
│     </div>                                               │
│     <button class="carousel-next">›</button>             │
│     <div class="carousel-dots">                          │
│       <button class="carousel-dot active"></button>      │
│       <button class="carousel-dot"></button>             │
│       <button class="carousel-dot"></button>             │
│     </div>                                               │
│   </div>                                                 │
│ </div>                                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Timeline: When Does `decorate` Run?

```
AUTHORING PHASE (Google Docs)
┌─────────────────────────────────────────┐
│ 1. Author creates Google Doc             │
│ 2. Inserts table with "carousel" block   │
│ 3. Fills rows with images & text         │
│ 4. Clicks "Publish" in Sidekick          │
└─────────────────────────────────────────┘
                    │
                    │ (Server-side)
                    ▼
┌─────────────────────────────────────────┐
│ EDS converts Doc → HTML                  │
│ Stores as .plain.html                    │
└─────────────────────────────────────────┘
                    │
                    │ (User opens page)
                    ▼
BROWSER PHASE (JavaScript runs)
┌─────────────────────────────────────────┐
│ 1. Browser loads HTML                    │
│ 2. Browser loads scripts.js              │
│ 3. scripts.js scans for blocks           │
│ 4. Finds <div class="carousel">          │
│ 5. Imports carousel.js                   │
│ 6. Calls decorate(block)  ← HERE!        │
│ 7. decorate transforms HTML              │
│ 8. Result: interactive carousel          │
└─────────────────────────────────────────┘
```

---

## 4. The `decorate` Function Signature

```
┌────────────────────────────────────────────────────────┐
│ export default function decorate(block) {              │
│                                                        │
│   // block = <div class="carousel">...</div>           │
│   // (the raw HTML from Google Docs)                   │
│                                                        │
│   // Read rows from block                              │
│   const rows = Array.from(                             │
│     block.querySelectorAll(':scope > div')             │
│   );                                                   │
│                                                        │
│   // Create structure                                  │
│   const wrapper = document.createElement('div');       │
│   // ... build DOM ...                                 │
│                                                        │
│   // Wire up events                                    │
│   prevBtn.addEventListener('click', () => {           │
│     slideIndex--;                                      │
│     showSlide(slideIndex);                             │
│   });                                                  │
│                                                        │
│   // Replace original content                          │
│   block.textContent = '';                              │
│   block.append(wrapper);                               │
│                                                        │
│   // Return (implicit) – block is now transformed      │
│ }                                                      │
└────────────────────────────────────────────────────────┘
```

---

## 5. Key Concept: `decorate` is the Bridge

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  GOOGLE DOC (Author's world)                            │
│  ├── Table with "carousel" block                        │
│  └── Rows with images & text                            │
│                                                         │
│  ↓ (Sidekick publishes)                                 │
│                                                         │
│  RAW HTML (EDS conversion)                              │
│  ├── <div class="carousel">                             │
│  └── Simple nested <div>s (rows)                        │
│                                                         │
│  ↓ (Browser loads page)                                 │
│                                                         │
│  ┌─────────────────────────────────────────┐            │
│  │  decorate(block) TRANSFORMS HERE        │            │
│  │  ← This is where the magic happens ←    │            │
│  └─────────────────────────────────────────┘            │
│                                                         │
│  INTERACTIVE CAROUSEL (User's experience)               │
│  ├── Slides with images                                 │
│  ├── Prev/Next buttons                                  │
│  ├── Dots for navigation                                │
│  └── Auto-rotate behavior                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 6. How to Present This Verbally

**Slide 1: The Flow**
- Show the top diagram (Browser → EDS scans → decorate called)

**Slide 2: What decorate does**
- Show the 6-step transformation (Input → Output)

**Slide 3: Timeline**
- Show when decorate runs (after page loads, not during build)

**Slide 4: The Bridge**
- Show how decorate connects Google Docs → interactive carousel

---

## Summary

> "When a page loads, EDS scans the HTML for `<div class="carousel">`.  
> For each one, it calls the `decorate(block)` function from `carousel.js`.  
> That function reads the raw HTML that came from the Google Doc,  
> transforms it into a full carousel structure with slides, buttons, and dots,  
> wires up all the click handlers and auto-rotation,  
> and replaces the original content with the final interactive component."
