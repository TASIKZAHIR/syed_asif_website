/* ==========================================================================
   Interactive Before & After Color Grading Slider Component
   Allows visitors to drag divider handle to compare RAW/LOG footage vs Final Grade
   ========================================================================== */

class BeforeAfterSlider {
  constructor(container) {
    this.container = container;
    this.beforeLayer = container.querySelector('.ba-before-layer');
    this.divider = container.querySelector('.ba-divider');
    this.handle = container.querySelector('.ba-handle');
    this.isDragging = false;

    if (!this.beforeLayer || !this.divider) return;

    this.init();
  }

  init() {
    // Initial position 50%
    this.setSliderPosition(50);

    // Mouse and Pointer Events on container
    this.container.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', () => this.onPointerUp());

    // Touch support fallback
    this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    window.addEventListener('touchend', () => this.onPointerUp());

    // Keyboard accessibility on handle
    if (this.handle) {
      this.handle.setAttribute('tabindex', '0');
      this.handle.setAttribute('role', 'slider');
      this.handle.setAttribute('aria-valuenow', '50');
      this.handle.setAttribute('aria-valuemin', '0');
      this.handle.setAttribute('aria-valuemax', '100');

      this.handle.addEventListener('keydown', (e) => {
        let currentPos = parseFloat(this.handle.getAttribute('aria-valuenow')) || 50;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          this.setSliderPosition(Math.max(0, currentPos - 5));
          e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          this.setSliderPosition(Math.min(100, currentPos + 5));
          e.preventDefault();
        }
      });
    }
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.container.classList.add('dragging');
    this.updatePositionFromEvent(e);
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    this.updatePositionFromEvent(e);
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove('dragging');
  }

  onTouchStart(e) {
    if (e.touches && e.touches[0]) {
      this.isDragging = true;
      this.updatePositionFromTouch(e.touches[0]);
    }
  }

  onTouchMove(e) {
    if (!this.isDragging) return;
    if (e.touches && e.touches[0]) {
      this.updatePositionFromTouch(e.touches[0]);
    }
  }

  updatePositionFromTouch(touch) {
    const rect = this.container.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    this.setSliderPosition(percentage);
  }

  updatePositionFromEvent(e) {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    this.setSliderPosition(percentage);
  }

  setSliderPosition(percentage) {
    // Clamp between 2% and 98%
    const clamped = Math.max(2, Math.min(98, percentage));

    this.beforeLayer.style.width = `${clamped}%`;
    this.divider.style.left = `${clamped}%`;

    if (this.handle) {
      this.handle.setAttribute('aria-valuenow', Math.round(clamped).toString());
    }
  }
}

// Global initialization function
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach((slider) => {
    new BeforeAfterSlider(slider);
  });
}

// Auto-run if DOM loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBeforeAfterSliders);
} else {
  initBeforeAfterSliders();
}

