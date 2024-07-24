document.addEventListener('DOMContentLoaded', function () {

  // Настройка слайдера
  function initSlider(sliderId, options = { infinite: false, autoScroll: false, slidesPerView: 1, responsive: false, slidesPerViewMob: 1, navigation: false, pagination: false, info: false }) {
    const slider = document.querySelector(`#${sliderId}`);
    const slides = slider.querySelector('.slides');
    const slide = slider.querySelectorAll('.slide');

    let currentIndex = 0;
    let slidesPerView = options.slidesPerView;
    let autoScrollInterval;

    function updateSlidesPerView() {
      if (options.responsive && window.innerWidth < 1024) {
        slidesPerView = options.slidesPerViewMob;
      } else {
        slidesPerView = options.slidesPerView;
      }
      slide.forEach(slide => {
        slide.style.width = `${100 / slidesPerView}%`;
      });
      updateSlider();
    }

    function createNavigation() {
      if (!options.navigation) return;
      const navigation = document.createElement('div');
      navigation.classList.add('navigation');
      navigation.innerHTML = `
          <button class="slider-button slider-button-prev" aria-label="Назад."></button>
          <button class="slider-button slider-button-next" aria-label="Вперед."></button>
        `;
      slider.appendChild(navigation);
    }

    createNavigation();
    const prev = slider.querySelector('.slider-button-prev');
    const next = slider.querySelector('.slider-button-next');

    function createPagination() {
      if (!options.pagination) return;
      const pagination = document.createElement('ul');
      pagination.classList.add('pagination');
      slider.appendChild(pagination);

      slide.forEach((_, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = index + 1;
        button.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
        });
        li.appendChild(button);
        pagination.appendChild(li);
      });
    }

    createPagination();
    const pagination = slider.querySelector('.pagination');

    function createInfo() {
      if (!options.info) return;
      const infoElement = document.createElement('div');
      infoElement.classList.add('slider-info');
      slider.appendChild(infoElement);
    }

    createInfo();
    const info = slider.querySelector('.slider-info');


    function updateSlider() {
      slides.style.transform = `translateX(-${currentIndex * (100 / slidesPerView)}%)`;
      updateButtons();
      updatePagination();
      updateInfo();
    }

    function updateButtons() {
      if (!options.infinite) {
        prev.disabled = currentIndex === 0;
        next.disabled = currentIndex === slide.length - slidesPerView;
        prev.classList.toggle('disabled', currentIndex === 0);
        next.classList.toggle('disabled', currentIndex === slide.length - slidesPerView);
      }
    }

    function updatePagination() {
      if (!pagination) return;
      const buttons = pagination.querySelectorAll('button');
      buttons.forEach((button, index) => {
        button.classList.toggle('is-active', index === currentIndex);
      });
    }

    function updateInfo() {
      if (!info) return;
      info.innerHTML = `<span>${currentIndex + slidesPerView}</span> <span>/</span> <span>${slide.length}<span>`;
    }

    prev.addEventListener('click', () => {
      if (options.infinite) {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slide.length - slidesPerView;
      } else if (currentIndex > 0) {
        currentIndex--;
      }
      if (options.autoScroll) {
        resetAutoScroll();
      }
      updateSlider();
    });

    next.addEventListener('click', () => {
      if (options.infinite) {
        currentIndex = (currentIndex < slide.length - slidesPerView) ? currentIndex + 1 : 0;
      } else if (currentIndex < slide.length - slidesPerView) {
        currentIndex++;
      }
      if (options.autoScroll) {
        resetAutoScroll();
      }
      updateSlider();
    });

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        next.click();
      }, 4000);
    }

    function resetAutoScroll() {
      clearInterval(autoScrollInterval);
      startAutoScroll();
    }

    if (options.autoScroll) {
      startAutoScroll();
    }

    if (options.responsive) {
      window.addEventListener('resize', updateSlidesPerView);
    }

    updateSlidesPerView();
    updateSlider();
  }


  // Инициализация слайдера "Участники"
  initSlider('slider-participants', {
    infinite: true,
    autoScroll: true,
    slidesPerView: 3,
    responsive: true,
    slidesPerViewMob: 1,
    navigation: true,
    info: true
  });


  // Инициализация слайдера "Этапы"
  if (window.innerWidth < 1024) {
    initSlider('slider-stages', {
      slidesPerView: 1,
      navigation: true,
      pagination: true
    });
  }


  // Отслеживание попадания элементов в зону видимости
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
      }
    })
  })

  const hiddenElements = document.querySelectorAll('.hidden')
  hiddenElements.forEach((element) => observer.observe(element));


  // Инициализация кастомного курсор
  function initCursor() {
    const cursor = document.querySelector('#cursor');

    let posX = 0;
    let posY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const ease = 0.1;

    function easeTo() {
      const cursorBounds = cursor.getBoundingClientRect();

      const dX = mouseX - (cursorBounds.left - 6);
      const dY = mouseY - (cursorBounds.top - 6);

      posX += dX * ease;
      posY += dY * ease;
    }

    function update() {
      easeTo();
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      requestAnimationFrame(update);
    }

    function setCoords(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    document.onmousemove = setCoords;
    update();
  }

  if(window.innerWidth > 1023) {
    initCursor();
  }

});
