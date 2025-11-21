export default function decorate(block) {
  // Gallery Carousel component: 4-column image grid with lightbox
  
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  console.warn('🎯 GALLERY CAROUSEL DEBUG - Total rows:', rows.length);
  
  // Log all rows for debugging
  rows.forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    const cellTexts = cells.map(cell => cell.textContent.trim().substring(0, 50)).join(' | ');
    console.warn(`🎯 Row ${idx}: ${cellTexts}`);
  });
  
  const container = document.createElement('div');
  container.classList.add('gallery-carousel-container');
  
  // Process each row as a gallery item
  rows.forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    
    if (cells.length >= 1) {
      const cell = cells[0];
      const img = cell.querySelector('img');
      const link = cell.querySelector('a');
      
      if (img) {
        const item = document.createElement('div');
        item.classList.add('gallery-carousel-item');
        
        // Create gallery link with lightbox
        const galleryLink = document.createElement('a');
        galleryLink.href = link?.href || img.src;
        galleryLink.classList.add('gallery-carousel-link');
        galleryLink.setAttribute('data-fancybox', 'gallery');
        galleryLink.setAttribute('data-caption', img.alt || '');
        
        // Set background image
        galleryLink.style.backgroundImage = `url('${img.src}')`;
        galleryLink.style.backgroundSize = 'cover';
        galleryLink.style.backgroundPosition = 'center';
        galleryLink.style.backgroundRepeat = 'no-repeat';
        
        // Create placeholder image
        const placeholderImg = document.createElement('img');
        placeholderImg.src = img.src;
        placeholderImg.alt = img.alt || '';
        placeholderImg.classList.add('gallery-carousel-placeholder');
        
        galleryLink.append(placeholderImg);
        item.append(galleryLink);
        container.append(item);
      }
    }
  });
  
  wrapper.append(container);
  
  block.textContent = '';
  block.append(wrapper);
  
  // Load Fancybox if available
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="gallery"]', {
      on: {
        reveal: (fancybox, slide) => {
          // Optional: add custom behavior
        }
      }
    });
  }
}
