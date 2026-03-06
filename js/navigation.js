// Navigation functionality
window.toggleRow = function (element) {
  const detailsRow = element.nextElementSibling;

  // If the clicked row is already expanded, just close it
  if (element.classList.contains('expanded')) {
    detailsRow.classList.remove('active');
    element.classList.remove('expanded');
    return;
  }

  // Close all other expanded rows first
  document.querySelectorAll('.work-table-row.expanded').forEach(row => {
    row.classList.remove('expanded');
    const details = row.nextElementSibling;
    if (details && details.classList.contains('work-table-details')) {
      details.classList.remove('active');
    }
  });

  // Open the newly clicked row
  if (detailsRow && detailsRow.classList.contains('work-table-details')) {
    detailsRow.classList.add('active');
    element.classList.add('expanded');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link (Desktop only - mobile menu is hidden on refresh anyway)
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
      }
    });
  });

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href').includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // --- Gliding Nav Indicator (Desktop Only) ---
  if (navMenu && window.innerWidth > 768) {
    const indicator = document.createElement('div');
    indicator.classList.add('nav-indicator');
    navMenu.style.position = 'relative';
    navMenu.appendChild(indicator);

    function positionIndicator(target, animate) {
      if (!target || !navMenu) return;
      const menuRect = navMenu.getBoundingClientRect();
      const linkRect = target.getBoundingClientRect();
      const left = linkRect.left - menuRect.left;
      if (!animate) {
        indicator.style.transition = 'none';
      }
      indicator.style.left = left + 'px';
      indicator.style.width = linkRect.width + 'px';
      if (!animate) {
        indicator.offsetHeight;
        indicator.style.transition = '';
      }
    }

    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      positionIndicator(activeLink, false);
    } else {
      indicator.style.width = '0';
    }

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', function () {
        positionIndicator(this, true);
      });
    });

    navMenu.addEventListener('mouseleave', function () {
      const current = document.querySelector('.nav-link.active');
      if (current) {
        positionIndicator(current, true);
      } else {
        indicator.style.width = '0';
      }
    });

    // Handle resize to keep indicator in place
    window.addEventListener('resize', () => {
      const current = document.querySelector('.nav-link.active');
      if (current) positionIndicator(current, false);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Fade in animations on scroll with Staggering
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  let staggeredElements = [];
  let staggerTimeout = null;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add to our staggering queue
        staggeredElements.push(entry.target);
        observer.unobserve(entry.target);
      }
    });

    // If we have elements to animate, set up the stagger
    if (staggeredElements.length > 0) {
      if (!staggerTimeout) {
        staggerTimeout = setTimeout(() => {
          // Sort elements vertically (top to bottom) so they animate in a logical flow
          staggeredElements.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            // If they are on the same vertical line (like a grid row), sort left to right
            if (Math.abs(rectA.top - rectB.top) < 50) {
              return rectA.left - rectB.left;
            }
            return rectA.top - rectB.top;
          });

          // Apply staggered delays
          staggeredElements.forEach((el, index) => {
            // Delay by 100ms per element, starting at 0
            el.style.animationDelay = `${index * 100}ms`;
            el.classList.add('fade-in');
          });

          // Reset queue
          staggeredElements = [];
          staggerTimeout = null;
        }, 50); // Small batching window to catch elements entering simultaneously
      }
    }
  }, observerOptions);

  document.querySelectorAll('.card, .section').forEach(el => {
    // Ensure they start hidden ready for animation
    el.style.opacity = '0';
    observer.observe(el);
  });

  // --- Smooth Page Transitions ---
  // Entrance is handled by CSS body::after (no JS needed)
  // Exit: create overlay on link click

  function triggerExit(href) {
    const exitOverlay = document.createElement('div');
    exitOverlay.classList.add('page-exit-overlay');
    document.body.appendChild(exitOverlay);
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  // Intercept internal links
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip: hash links, external protocols, new-tab links, downloads
      if (!href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        this.target === '_blank' ||
        this.hasAttribute('download')) {
        return;
      }

      // Allow ctrl/cmd+click to open in new tab
      if (e.metaKey || e.ctrlKey) return;

      // On mobile, let the browser handle the link naturally for maximum reliability.
      // The menu will be closed on the next page load anyway.
      if (window.innerWidth <= 768) {
        return;
      }

      e.preventDefault();

      // Check if this is a nav link — if so, glide the indicator first
      const isNavLink = this.classList.contains('nav-link');

      if (isNavLink) {
        // Glide indicator to the clicked link
        if (typeof positionIndicator === 'function') {
          positionIndicator(this, true);
        }

        // Wait for glide, then cover and navigate
        setTimeout(() => {
          triggerExit(href);
        }, 350);
      } else {
        triggerExit(href);
      }
    });
  });
});
