import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  
  const container = document.createElement('div');
  container.classList.add('image-grid-container');
  
  rows.forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    
    cells.forEach((cell) => {
      const img = cell.querySelector('img');
      
      if (img) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('image-grid-item');
        if (idx === 0) gridItem.classList.add('large');
        
        const picture = createOptimizedPicture(img.src, img.alt, false, [
          { width: '1200' },
          { width: '800' },
        ]);
        
        const link = document.createElement('a');
        link.href = img.src;
        link.setAttribute('data-fancybox', 'image-grid');
        link.append(picture);
        
        gridItem.append(link);
        container.append(gridItem);
      }
    });
  });
  
  block.textContent = '';
  block.append(container);
}
