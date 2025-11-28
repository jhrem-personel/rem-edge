import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Gallery Grid block: Asymmetric layout (60% large image + 40% grid)
  
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  const images = [];
  
  // Collect all images
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    cells.forEach((cell) => {
      const img = cell.querySelector('img');
      if (img) {
        images.push(img);
      }
    });
  });
  
  if (images.length === 0) return;
  
  // Create main container
  const container = document.createElement('div');
  container.classList.add('gallery-grid-container');
  
  // Create left section (large image)
  const leftSection = document.createElement('div');
  leftSection.classList.add('gallery-grid-left');
  
  const largeItem = createGalleryItem(images[0]);
  largeItem.classList.add('gallery-grid-large');
  leftSection.append(largeItem);
  
  // Create right section (grid)
  const rightSection = document.createElement('div');
  rightSection.classList.add('gallery-grid-right');
  
  // Top row: 2 images side by side
  const topRow = document.createElement('div');
  topRow.classList.add('gallery-grid-top-row');
  
  if (images[1]) {
    const item2 = createGalleryItem(images[1]);
    item2.classList.add('gallery-grid-small');
    topRow.append(item2);
  }
  
  if (images[2]) {
    const item3 = createGalleryItem(images[2]);
    item3.classList.add('gallery-grid-small');
    topRow.append(item3);
  }
  
  rightSection.append(topRow);
  
  // Bottom row: 1 full-width image
  if (images[3]) {
    const bottomRow = document.createElement('div');
    bottomRow.classList.add('gallery-grid-bottom-row');
    
    const item4 = createGalleryItem(images[3]);
    item4.classList.add('gallery-grid-full-width');
    bottomRow.append(item4);
    
    rightSection.append(bottomRow);
  }
  
  container.append(leftSection);
  container.append(rightSection);
  
  block.textContent = '';
  block.append(container);
}

function createGalleryItem(img) {
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('gallery-grid-item');
  
  // Get full-size image URL for lightbox
  const fullSizeUrl = img.src.replace(/-\d+x\d+\./, '.');
  
  const picture = createOptimizedPicture(img.src, img.alt, false, [
    { width: '600' },
    { width: '400' },
  ]);
  picture.classList.add('gallery-grid-image');
  
  const link = document.createElement('a');
  link.href = fullSizeUrl;
  link.setAttribute('data-fancybox', 'gallery');
  link.setAttribute('data-caption', img.alt || '');
  link.classList.add('gallery-grid-link');
  link.append(picture);
  
  galleryItem.append(link);
  return galleryItem;
}
