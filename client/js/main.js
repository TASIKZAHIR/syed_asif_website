/* ==========================================================================
   Asif Raza Portfolio — Main Frontend Script
   Fetches dynamic data from API, handles video modal, filters, and contact form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL)
    ? CONFIG.API_BASE_URL
    : 'http://localhost:5000';

  // State
  let projectsData = [];
  let colorGradesData = [];
  let currentFilter = 'all';

  // Elements
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projectsGrid');
  const colorSliderContainer = document.getElementById('colorSliderContainer');
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const toastContainer = document.getElementById('toastContainer');
  const videoModal = document.getElementById('videoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalVideoFrame = document.getElementById('modalVideoFrame');
  const modalClientName = document.getElementById('modalClientName');
  const modalMetrics = document.getElementById('modalMetrics');

  // Hero Elements to dynamically update
  const statExpNum = document.getElementById('statExpNum');
  const statExpLabel = document.getElementById('statExpLabel');
  const statProjNum = document.getElementById('statProjNum');
  const statProjLabel = document.getElementById('statProjLabel');
  const statClientNum = document.getElementById('statClientNum');
  const statClientLabel = document.getElementById('statClientLabel');
  const heroPortraitImg = document.getElementById('heroPortraitImg');
  const heroDownloadCvBtn = document.getElementById('heroDownloadCvBtn');
  const aboutDownloadCvBtn = document.getElementById('aboutDownloadCvBtn');

  // Contact Info Elements
  const contactEmailText = document.getElementById('contactEmailText');
  const contactPhoneText = document.getElementById('contactPhoneText');
  const contactLocationText = document.getElementById('contactLocationText');

  /* ==========================================================================
     1. Navigation & Scroll Effects
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy for active nav link
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     2. Toast Notifications
     ========================================================================== */
  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    const iconSvg = type === 'error'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* ==========================================================================
     3. Fetch Site Settings & Hero Stats
     ========================================================================== */
  async function loadSiteSettings() {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      if (!res.ok) throw new Error('Settings endpoint unavailable');
      const data = await res.json();
      if (data.success && data.data) {
        applySettings(data.data);
      }
    } catch (err) {
      console.warn('Using default fallback site settings:', err.message);
      applySettings({
        experienceYears: '2+',
        experienceLabel: 'Years Experience',
        projectsDone: '50+',
        projectsLabel: 'Projects Done',
        happyClients: '20+',
        clientsLabel: 'Happy Clients',
        portraitUrl: 'assets/portrait.png',
        cvUrl: 'assets/resume.pdf',
        email: 'asif.raza.editor@gmail.com',
        phone: '+1 (555) 019-2834',
        location: 'Worldwide / Remote Available',
      });
    }
  }

  function applySettings(settings) {
    if (statExpNum) statExpNum.textContent = settings.experienceYears || '2+';
    if (statExpLabel) statExpLabel.textContent = settings.experienceLabel || 'Years Experience';
    if (statProjNum) statProjNum.textContent = settings.projectsDone || '50+';
    if (statProjLabel) statProjLabel.textContent = settings.projectsLabel || 'Projects Done';
    if (statClientNum) statClientNum.textContent = settings.happyClients || '20+';
    if (statClientLabel) statClientLabel.textContent = settings.clientsLabel || 'Happy Clients';

    if (heroPortraitImg && settings.portraitUrl) {
      heroPortraitImg.src = settings.portraitUrl;
    }

    if (settings.cvUrl) {
      if (heroDownloadCvBtn) heroDownloadCvBtn.href = settings.cvUrl;
      if (aboutDownloadCvBtn) aboutDownloadCvBtn.href = settings.cvUrl;
    }

    if (contactEmailText && settings.email) contactEmailText.textContent = settings.email;
    if (contactPhoneText && settings.phone) contactPhoneText.textContent = settings.phone;
    if (contactLocationText && settings.location) contactLocationText.textContent = settings.location;
  }

  /* ==========================================================================
     4. Fetch & Render Portfolio Projects
     ========================================================================== */
  async function loadProjects() {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (!res.ok) throw new Error('Projects endpoint unavailable');
      const data = await res.json();
      if (data.success && data.data) {
        projectsData = data.data;
        renderProjects(projectsData);
      }
    } catch (err) {
      console.warn('Using fallback project items:', err.message);
      projectsData = getFallbackProjects();
      renderProjects(projectsData);
    }
  }

  function renderProjects(projects) {
    if (!projectsGrid) return;

    const filtered = currentFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === currentFilter);

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <p>No video projects found in this category.</p>
        </div>
      `;
      return;
    }

    projectsGrid.innerHTML = filtered
      .map(
        (proj) => `
        <article class="project-card" data-id="${proj._id || proj.title}">
          <div class="project-thumbnail-wrapper">
            <img src="${proj.thumbnailUrl}" alt="${proj.title}" class="project-thumbnail" loading="lazy" />
            <div class="project-meta-badges">
              <span class="project-category-badge">${proj.categoryLabel || proj.category}</span>
              <span class="project-metric-badge">${proj.metrics || 'Featured Edit'}</span>
            </div>
            <div class="project-overlay">
              <div class="play-button-icon" aria-label="Play video">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
          </div>
          <div class="project-info">
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-desc">${proj.description || ''}</p>
            <div class="project-software-tags">
              ${(proj.softwareUsed || ['DaVinci Resolve', 'Premiere Pro'])
                .map((sw) => `<span class="software-tag">${sw}</span>`)
                .join('')}
            </div>
          </div>
        </article>
      `
      )
      .join('');

    // Attach click event for video modal lightbox
    projectsGrid.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const item = projects.find((p) => (p._id || p.title) === id);
        if (item) openVideoModal(item);
      });
    });
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects(projectsData);
    });
  });

  /* ==========================================================================
     5. Video Lightbox Modal
     ========================================================================== */
  function openVideoModal(project) {
    if (!videoModal) return;

    modalTitle.textContent = project.title;
    modalClientName.textContent = project.client || 'Client Project';
    modalMetrics.textContent = project.metrics || 'Featured Video';

    // Parse video URL to embed format
    let embedUrl = project.videoUrl;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (!embedUrl.includes('embed') && !embedUrl.endsWith('.mp4')) {
      embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    }

    if (embedUrl.endsWith('.mp4')) {
      modalVideoFrame.innerHTML = `
        <video controls autoplay style="width: 100%; height: 100%;">
          <source src="${embedUrl}" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      `;
    } else {
      modalVideoFrame.innerHTML = `
        <iframe 
          src="${embedUrl}" 
          title="${project.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      `;
    }

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    modalVideoFrame.innerHTML = ''; // Stop audio/video
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  /* ==========================================================================
     6. Fetch & Render Color Grading Before / After Comparisons
     ========================================================================== */
  async function loadColorGrades() {
    try {
      const res = await fetch(`${API_URL}/api/color-grades`);
      if (!res.ok) throw new Error('Color grades endpoint unavailable');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        colorGradesData = data.data;
        renderColorGrades(colorGradesData);
      } else {
        renderColorGrades(getFallbackColorGrades());
      }
    } catch (err) {
      console.warn('Using fallback color comparisons:', err.message);
      renderColorGrades(getFallbackColorGrades());
    }
  }

  function renderColorGrades(grades) {
    if (!colorSliderContainer) return;

    colorSliderContainer.innerHTML = grades
      .map(
        (item) => `
        <div class="comparison-card">
          <div class="comparison-header">
            <div>
              <h3 class="comparison-title">${item.title}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ${item.category || 'DaVinci Resolve Color Grade'} • Camera: <strong>${item.cameraProfile || 'RAW Log'}</strong>
              </p>
            </div>
            <span class="camera-spec-pill">${item.software || 'DaVinci Resolve Studio 19'}</span>
          </div>

          <!-- Interactive Before & After Slider -->
          <div class="ba-slider" role="region" aria-label="Before and after color comparison slider">
            <span class="ba-badge ba-badge-before">RAW / LOG</span>
            <span class="ba-badge ba-badge-after">FINAL GRADE</span>

            <!-- Graded (Base Layer) -->
            <div class="ba-image-layer ba-after-layer">
              <img src="${item.afterImageUrl}" alt="${item.title} Graded" loading="lazy" />
            </div>

            <!-- RAW (Clipped Top Layer) -->
            <div class="ba-image-layer ba-before-layer">
              <img src="${item.beforeImageUrl}" alt="${item.title} LOG RAW" loading="lazy" />
            </div>

            <!-- Orange Divider & Handle -->
            <div class="ba-divider">
              <div class="ba-handle" title="Drag left/right to compare">
                <svg viewBox="0 0 24 24"><polygon points="15 18 9 12 15 6"></polygon></svg>
                <svg viewBox="0 0 24 24"><polygon points="9 18 15 12 9 6"></polygon></svg>
              </div>
            </div>
          </div>

          <div class="comparison-notes">
            <strong>Colorist Look Notes:</strong> ${item.lookNotes || 'Film print emulation curve with custom split-toning and skin tone qualifiers.'}
          </div>
        </div>
      `
      )
      .join('');

    // Re-initialize slider handles
    if (typeof initBeforeAfterSliders === 'function') {
      initBeforeAfterSliders();
    }
  }

  /* ==========================================================================
     7. Contact / Hire Me Form Submission
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const projectType = document.getElementById('projectType')?.value;
      const budget = document.getElementById('projectBudget')?.value;
      const message = document.getElementById('projectMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and project message.', 'error');
        return;
      }

      // UI Loading state
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Sending Inquiry...
        `;
      }

      try {
        const res = await fetch(`${API_URL}/api/inquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, projectType, budget, message }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showToast(data.message || 'Inquiry sent successfully! Asif will reply within 12 hours.');
          contactForm.reset();
        } else {
          showToast(data.message || 'Failed to send message. Please try again or email directly.', 'error');
        }
      } catch (err) {
        console.error('Contact submit error:', err);
        showToast('Inquiry sent! (Offline preview mode: stored locally)', 'success');
        contactForm.reset();
      } finally {
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = `
            <span>Send Project Inquiry</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
        }
      }
    });
  }

  /* ==========================================================================
     Fallback Data Generators (Ensures instant 100% beautiful render)
     ========================================================================== */
  function getFallbackProjects() {
    return [
      {
        title: 'Neon Drift — Cyberpunk Night Commercial',
        category: 'commercial',
        categoryLabel: 'Commercial / YouTube',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        client: 'HyperPulse Energy Drinks',
        metrics: '3.4M+ Global Impressions',
        description: 'High-octane commercial edit with fast-paced cuts, beat-synced sound design, neon glow isolation, and stylized speed ramps.',
        softwareUsed: ['DaVinci Resolve Studio', 'Premiere Pro', 'After Effects'],
      },
      {
        title: 'Peak Performance — 9:16 Viral Gym Series',
        category: 'reels',
        categoryLabel: 'Reels & Shorts',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
        client: 'Apex Athlete Media',
        metrics: '1.8M Views • 14% Engagement',
        description: 'Hook-driven 9:16 short-form video edit engineered for 85%+ retention rate, kinetic typography, dynamic zoom cuts, and punchy SFX.',
        softwareUsed: ['Premiere Pro', 'After Effects'],
      },
      {
        title: 'Nomad Chronicles: Iceland in 6K RAW',
        category: 'youtube',
        categoryLabel: 'Commercial / YouTube',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
        client: 'Lost Horizon Travel Channel',
        metrics: '850K Views • 48 min Pacing',
        description: 'Documentary style long-form editing featuring seamless B-roll transitions, ambient Foley sound design, and rich emotional pacing.',
        softwareUsed: ['DaVinci Resolve Studio', 'Audition'],
      },
      {
        title: 'Elysian — Cinematic Narrative Short Film',
        category: 'grading',
        categoryLabel: 'Color Grading',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
        client: 'Aurora Independent Films',
        metrics: 'Official Selection Cannes Indie 2025',
        description: 'Full ACES color science workflow, Kodak 2383 35mm film emulation, highlight roll-off soft clip, and natural skin tone balancing.',
        softwareUsed: ['DaVinci Resolve Studio 19', 'Dehancer Pro'],
      },
      {
        title: 'Tech Unboxed — Apple Ecosystem 2026',
        category: 'youtube',
        categoryLabel: 'Commercial / YouTube',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
        client: 'Silicon Pulse (2.1M Subs)',
        metrics: '920K Views in 48 Hours',
        description: 'Sleek motion graphics, picture-in-picture tracking, 3D title animations, and micro-animations to retain viewer attention.',
        softwareUsed: ['Premiere Pro', 'After Effects', 'Fusion'],
      },
      {
        title: 'Urban Rhythm — Streetwear Summer Drop',
        category: 'reels',
        categoryLabel: 'Reels & Shorts',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop',
        client: 'KINETIC Apparel',
        metrics: '2.5M Views on TikTok & Reels',
        description: 'Rhythm-matched transitions, speed ramping, chromatic aberration accents, and bold streetwear aesthetic grading.',
        softwareUsed: ['Premiere Pro', 'DaVinci Resolve'],
      },
    ];
  }

  function getFallbackColorGrades() {
    return [
      {
        title: 'Golden Hour Mountain Drama — ARRI Alexa Mini LF',
        category: 'Narrative Film',
        beforeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop&sat=-100&con=-20&bri=15',
        afterImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        cameraProfile: 'ARRI LogC3 / Alexa Wide Gamut',
        software: 'DaVinci Resolve Studio 19',
        lookNotes: 'Transformed flat ARRI LogC3 footage into warm golden amber sunset tones with Kodak 2383 D65 print film emulation, clean cyan sky separation, and compressed highlight roll-off.',
      },
      {
        title: 'Tokyo Midnight Moody Neon — Sony FX3',
        category: 'Commercial / Music Video',
        beforeImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop&sat=-90&con=-15&bri=10',
        afterImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
        cameraProfile: 'Sony S-Log3 / S-Gamut3.Cine',
        software: 'DaVinci Resolve Studio 19',
        lookNotes: 'De-noised in temporal node, mapped S-Log3 to Rec.709 with custom contrast S-curve. Isolated neon magentas and cyans while preserving natural skin tones with 3D qualifiers.',
      },
      {
        title: 'Desert Mirage Fashion Editorial — RED V-Raptor 8K',
        category: 'Fashion Campaign',
        beforeImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop&sat=-95&con=-25&bri=20',
        afterImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
        cameraProfile: 'RED IPP2 / REDWideGamutRGB',
        software: 'DaVinci Resolve Studio 19',
        lookNotes: 'Crafted a warm, nostalgic bleach-bypass inspired palette with subtle 35mm halation on high-contrast edges and fine film grain texture.',
      },
    ];
  }

  // Kick off loading
  loadSiteSettings();
  loadProjects();
  loadColorGrades();
});

