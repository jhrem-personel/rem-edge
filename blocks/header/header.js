import { getMetadata } from '../../scripts/aem.js';

// Media query for responsive behavior
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Toggles all nav sections
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav menu (mobile)
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!navSections) return;
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  
  const button = nav.querySelector('.navbar-toggler');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/**
 * Close menu on Escape key
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const navSections = nav.querySelector('.navbar-collapse');
    if (!navSections) return;
    if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

/**
 * Main header decorator function
 */
export default async function decorate(block) {
  // Load navigation from fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Clear block content
  block.textContent = '';

  // Create main header structure
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('menubar', 'w-full');
  headerDiv.setAttribute('data-aos', 'fade-right');
  headerDiv.setAttribute('data-aos-easing', 'ease-in-out');
  headerDiv.setAttribute('data-aos-delay', '0');
  headerDiv.setAttribute('data-aos-duration', '500');

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row');

  // LOGO SECTION (Left side)
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-6', 'col-sm-6', 'col-md-3', 'col-lg-2');

  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.acerbisoem.com/';
  logoLink.classList.add('logo');

  const logoImg = document.createElement('img');
  logoImg.src = 'https://www.acerbisoem.com/wp-content/uploads/2024/07/acerbis-oem-label-1.png';
  logoImg.alt = 'Acerbis OEM';

  logoLink.append(logoImg);
  logoCol.append(logoLink);
  row.append(logoCol);

  // NAVIGATION SECTION (Right side)
  const navCol = document.createElement('div');
  navCol.classList.add('col-6', 'col-sm-6', 'col-md-9', 'col-lg-10');

  // Top bar with language and buttons
  const hdrSopra = document.createElement('div');
  hdrSopra.classList.add('hdr-sopra', 'clearfix');

  // Language selector
  const langSelector = document.createElement('div');
  langSelector.classList.add('box-icl_language_selector', 'float-right');
  langSelector.innerHTML = `
    <div class="wpml-ls wpml-ls-legacy-dropdown-click">
      <ul role="menu">
        <li class="wpml-ls-item wpml-ls-item-it wpml-ls-current-language" role="none">
          <a href="#" class="js-wpml-ls-item-toggle" role="menuitem">
            <span class="wpml-ls-native">ITA</span>
          </a>
          <ul class="js-wpml-ls-sub-menu wpml-ls-sub-menu" role="menu">
            <li class="wpml-ls-item wpml-ls-item-en" role="none">
              <a href="#" class="wpml-ls-link" role="menuitem">
                <span class="wpml-ls-native">ENG</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `;

  // Buttons
  const contactsBtn = document.createElement('a');
  contactsBtn.href = 'https://www.acerbis.com/it/contatti';
  contactsBtn.target = '_blank';
  contactsBtn.classList.add('button', 'float-right', 'ms-2');
  contactsBtn.textContent = 'Contacts';

  const acerbisWorldBtn = document.createElement('a');
  acerbisWorldBtn.href = 'https://www.acerbis.com/it';
  acerbisWorldBtn.target = '_blank';
  acerbisWorldBtn.classList.add('button', 'float-right');
  acerbisWorldBtn.textContent = 'Acerbis World';

  hdrSopra.append(contactsBtn);
  hdrSopra.append(acerbisWorldBtn);
  hdrSopra.append(langSelector);

  navCol.append(hdrSopra);

  // Navigation bar
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar', 'navbar-expand-lg', 'nopad');

  // Mobile hamburger button
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler', 'collapsed');
  toggler.setAttribute('type', 'button');
  toggler.setAttribute('aria-controls', 'navbarSupportedContent');
  toggler.setAttribute('aria-label', 'Toggle navigation');
  toggler.innerHTML = `
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  `;

  navbar.append(toggler);

  // Parse navigation from block content (table)
  const table = block.querySelector('table');
  if (!table) return;

  // Extract navigation items from table
  const labels = [];
  const rows = table.querySelectorAll('tr');
  
  // Skip first row (header row)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    if (cells.length > 0) {
      const cell = cells[0];
      const ul = cell.querySelector('ul');
      if (ul) {
        ul.querySelectorAll('li').forEach((li) => {
          const a = li.querySelector('a');
          let text = '';
          let url = '';

          if (a) {
            text = a.textContent.trim();
            url = a.href;
          } else {
            const ownTextNode = Array.from(li.childNodes)
              .find((n) => n.nodeType === Node.TEXT_NODE);
            text = (ownTextNode ? ownTextNode.textContent : '').trim();
          }

          if (text && !labels.find((l) => l.text === text)) {
            labels.push({ text, url });
          }
        });
      }
    }
  }

  // Build navigation structure
  const navItems = [
    { label: labels[0], children: labels.slice(1, 4) },      // Acerbis + 3 items
    { label: labels[4], children: labels.slice(5, 10) },     // Sectors + 5 items
    { label: labels[10], children: labels.slice(11, 13) },   // Technologies + 2 items
    { label: labels[13], children: labels.slice(14, 16) },   // Engineering + 2 items
    { label: labels[16], children: [] },                      // Work with us
  ];

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('collapse', 'navbar-collapse');
  navCollapse.id = 'navbarSupportedContent';

  const navUl = document.createElement('ul');
  navUl.id = 'menu-header-menu';
  navUl.classList.add('header-menu', 'ms-auto');

  navItems.forEach((item, idx) => {
    if (!item.label) return;

    const li = document.createElement('li');
    li.classList.add('nav-item');
    if (item.children.length > 0) {
      li.classList.add('dropdown');
    }

    const a = document.createElement('a');
    a.href = item.label.url || '#';
    a.classList.add('nav-link');
    a.textContent = item.label.text;

    if (item.children.length > 0) {
      a.classList.add('dropdown-toggle');
      a.setAttribute('data-bs-toggle', 'dropdown');
      a.setAttribute('aria-haspopup', 'true');
      a.setAttribute('aria-expanded', 'false');

      const dropdownUl = document.createElement('ul');
      dropdownUl.classList.add('dropdown-menu');

      item.children.forEach((child) => {
        if (!child.text) return;

        const dropdownLi = document.createElement('li');
        const dropdownA = document.createElement('a');
        dropdownA.href = child.url || '#';
        dropdownA.classList.add('dropdown-item');
        dropdownA.textContent = child.text;

        dropdownLi.append(dropdownA);
        dropdownUl.append(dropdownLi);
      });

      li.append(a);
      li.append(dropdownUl);
    } else {
      li.append(a);
    }

    navUl.append(li);
  });

  navCollapse.append(navUl);
  navbar.append(navCollapse);
  navCol.append(navbar);

  row.append(navCol);
  container.append(row);
  headerDiv.append(container);
  block.append(headerDiv);

  // Mobile menu toggle
  const navSections = navbar.querySelector('.navbar-collapse');
  if (navSections) {
    toggler.addEventListener('click', () => toggleMenu(navbar, navSections));
    navbar.setAttribute('aria-expanded', 'false');
    toggleMenu(navbar, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(navbar, navSections, isDesktop.matches));
  }

  // Keyboard navigation
  window.addEventListener('keydown', closeOnEscape);
}
