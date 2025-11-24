export default function decorate(block) {
  // Locations Cards block: facility cards with image, title, and address
  
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  console.warn('🎯 LOCATIONS CARDS - Total rows:', rows.length);
  console.warn('🎯 Block HTML:', block.innerHTML.substring(0, 200));
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('locations-cards-wrapper');
  
  // Process each row as a location card (skip first row which is block name)
  rows.slice(1).forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    console.warn(`🎯 Row ${idx + 1} - Cells:`, cells.length);
    
    // Log cell content for debugging
    cells.forEach((cell, cellIdx) => {
      const hasImg = cell.querySelector('img') ? 'YES' : 'NO';
      const text = cell.textContent.trim().substring(0, 50);
      console.warn(`  Cell ${cellIdx}: Image=${hasImg}, Text="${text}"`);
      console.warn(`  Cell ${cellIdx} HTML:`, cell.innerHTML.substring(0, 100));
    });
    
    // Need at least 2 cells (image + title, address optional)
    if (cells.length >= 1) {
      const card = document.createElement('div');
      card.classList.add('location-card');
      
      // Image container - check first cell for image
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('location-card-image');
      
      let img = cells[0].querySelector('img');
      if (img) {
        const newImg = img.cloneNode(true);
        imageContainer.append(newImg);
        console.warn(`  ✅ Image found in cell 0`);
      } else {
        // Try to find image in any cell
        img = cells.find(cell => cell.querySelector('img'))?.querySelector('img');
        if (img) {
          const newImg = img.cloneNode(true);
          imageContainer.append(newImg);
          console.warn(`  ✅ Image found in another cell`);
        } else {
          // Fallback: use placeholder
          imageContainer.style.backgroundColor = '#e0e0e0';
          imageContainer.style.display = 'flex';
          imageContainer.style.alignItems = 'center';
          imageContainer.style.justifyContent = 'center';
          imageContainer.textContent = 'Image';
          imageContainer.style.color = '#999';
          imageContainer.style.fontSize = '14px';
        }
      }
      
      // Content container (black background)
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('location-card-content');
      
      // Extract title and address from remaining cells
      let titleText = '';
      let addressText = '';
      
      // If we have 3+ cells: cell[0]=image, cell[1]=title, cell[2]=address
      // If we have 2 cells: cell[0]=image, cell[1]=title+address combined
      if (cells.length >= 3) {
        titleText = cells[1].textContent.trim();
        addressText = cells[2].textContent.trim();
      } else if (cells.length === 2) {
        // Split the second cell by newline or use as title
        const text = cells[1].textContent.trim();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        titleText = lines[0] || '';
        addressText = lines[1] || '';
      } else if (cells.length === 1) {
        // Only image cell, try to extract from text content
        titleText = '';
        addressText = '';
      }
      
      // Title
      const title = document.createElement('div');
      title.classList.add('location-card-title');
      title.textContent = titleText;
      
      // Address
      const address = document.createElement('div');
      address.classList.add('location-card-address');
      address.textContent = addressText;
      
      // Triangle accent
      const triangle = document.createElement('div');
      triangle.classList.add('location-card-triangle');
      
      contentContainer.append(title);
      contentContainer.append(address);
      contentContainer.append(triangle);
      
      card.append(imageContainer);
      card.append(contentContainer);
      wrapper.append(card);
      
      console.warn(`  ✅ Card created: "${titleText}"`);
    }
  });
  
  block.textContent = '';
  block.append(wrapper);
}
