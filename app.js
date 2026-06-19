/* ==========================================================================
   TATTOO MAGINK - LÓGICA E INTERACTIVIDAD (ES6 VANILLA JS)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // CONFIGURACIÓN DE SUPABASE
  // ==========================================================================
  const supabaseUrl = 'https://jfiysjwtsfqlaodxrtvf.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaXlzand0c2ZxbGFvZHhydHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzcyODIsImV4cCI6MjA5NzQxMzI4Mn0.qSrCd1lEogq9g_KMdJxbD6rkY8z0uLMDk8DKuS4-eco';
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  // ==========================================================================
  // 0. PANTALLA DE INTRODUCCIÓN (GRAFFITI INTRO)
  // ==========================================================================
  const introScreen = document.getElementById('js-intro-screen');
  const introLogo = document.getElementById('js-intro-logo');
  const sprayNozzle = document.getElementById('js-spray-nozzle');
  const heroBg = document.querySelector('.hero-bg-image');

  if (introScreen && introLogo && sprayNozzle) {
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      introLogo.style.opacity = '1';
      introLogo.style.clipPath = 'inset(0 0 0 0)';
      sprayNozzle.style.animation = 'sprayMove 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }, 300);

    setTimeout(() => {
      introScreen.classList.add('fade-out');
      document.body.style.overflow = '';
      
      if (heroBg) {
        heroBg.style.transform = 'scale(1)';
      }
    }, 2400);
  }
  
  // ==========================================================================
  // 1. CURSOR PERSONALIZADO (DOT & FOLLOWER)
  // ==========================================================================
  const cursor = document.getElementById('js-cursor');
  const follower = document.getElementById('js-cursor-follower');
  
  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });
    
    const renderCursor = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      
      requestAnimationFrame(renderCursor);
    };
    renderCursor();
    
    const interactives = document.querySelectorAll('a, button, input, textarea, select, .portfolio-card, .style-option-card, .zone-pill, .cal-day, .slot-radio');
    
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-interactive');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-interactive');
      });
    });
  }

  // ==========================================================================
  // 2. HEADER SCROLL EFFECT & RESPONSIVE MENU
  // ==========================================================================
  const header = document.getElementById('js-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const menuToggle = document.getElementById('js-menu-toggle');
  const navMenu = document.getElementById('js-nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 3. PORTFOLIO FILTER & LIGHTBOX
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('js-portfolio-grid');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      filterBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
      
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const filterValue = btn.getAttribute('data-filter');
      
      portfolioCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hide');
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.classList.add('hide');
          }
        }, 300);
      });
    });
  });

  // Modal Lightbox
  const lightbox = document.getElementById('js-lightbox');
  const lightboxImg = document.getElementById('js-lightbox-img');
  const lightboxArtist = document.getElementById('js-lightbox-artist');
  const lightboxTitle = document.getElementById('js-lightbox-title');
  const lightboxTag = document.getElementById('js-lightbox-tag');
  const lightboxClose = document.getElementById('js-lightbox-close');
  const lightboxCta = document.getElementById('js-lightbox-booking-btn');

  const portfolioDetails = {
    "1": { desc: "Una ilustración de cráneo y rosa adaptada de un diseño para tabla de skate. Realizada con sombreados densos de blackwork puro y líneas gruesas con una fuerte influencia de la estética gótica y punk." },
    "3": { desc: "Daga gótica con enredadera de rosas en estilo neo-tradicional. Inspirada en la iconografía clásica de la vieja escuela combinada con el carácter crudo del arte urbano de skate." },
    "4": { desc: "Caligrafía e ilustración de línea fina en estilo tipográfico gótico medieval y runas antiguas. Máxima precisión en trazos sutiles pero con un impacto visual oscuro." },
    "5": { desc: "Criatura de la cripta a full color. Ilustración neo-gótica con una paleta vibrante que destaca tonos violetas neón y negros sólidos, evocando arte de portadas de discos de rock pesado." },
    "6": { desc: "Micro-diseño de calavera minimalista con líneas geométricas finas, ideal para una pieza sutil pero con el carácter oscuro de Tattoo Magink." }
  };

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const img = card.querySelector('img').getAttribute('src');
      const artist = card.querySelector('.card-artist').textContent;
      const title = card.querySelector('.card-title').textContent;
      const style = card.querySelector('.card-style-tag').textContent;
      
      lightboxImg.setAttribute('src', img);
      lightboxArtist.textContent = artist;
      lightboxTitle.textContent = title;
      lightboxTag.textContent = style;
      
      const details = portfolioDetails[id];
      if (details) {
        document.querySelector('.lightbox-desc').textContent = details.desc;
      }
      
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxCta) {
    lightboxCta.addEventListener('click', () => {
      const style = lightboxTag.textContent.split(' ')[0];
      
      const styleRadio = document.querySelector(`input[name="booking_style"][value="${style}"]`);
      if (styleRadio) {
        styleRadio.checked = true;
        styleRadio.dispatchEvent(new Event('change'));
      }
      
      closeLightbox();
      document.getElementById('reserva').scrollIntoView({ behavior: 'smooth' });
      goToStep(2); // Ir automáticamente al Paso 2 del formulario (Zona y Medida)
    });
  }

  // ==========================================================================
  // 4. EMBUDO DE RESERVAS AUTOMÁTICO (WIZARD MULTI-ETAPA - 4 PASOS)
  // ==========================================================================
  const bookingForm = document.getElementById('js-booking-form');
  const bookingSuccess = document.getElementById('js-booking-success');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressBar = document.getElementById('js-progress-bar');
  const prevBtn = document.getElementById('js-wizard-prev');
  const nextBtn = document.getElementById('js-wizard-next');
  const submitBtn = document.getElementById('js-wizard-submit');
  
  let currentStep = 1;
  const totalSteps = 4;

  const updateProgress = () => {
    const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${percent}%`;
    
    progressSteps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      if (stepNum < currentStep) {
        step.classList.remove('active');
        step.classList.add('completed');
      } else if (stepNum === currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  };

  const showStepPane = () => {
    const panes = document.querySelectorAll('.booking-step-pane');
    panes.forEach(pane => {
      const step = parseInt(pane.getAttribute('data-step'));
      if (step === currentStep) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }

    if (currentStep === 4) {
      updateSummaryPreview();
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep = step;
      updateProgress();
      showStepPane();
    }
  };

  // Validaciones
  const validateStep = (step) => {
    let isValid = true;
    
    if (step === 1) {
      const selectedStyle = document.querySelector('input[name="booking_style"]:checked');
      const err = document.getElementById('error-step-1');
      if (!selectedStyle) {
        err.style.display = 'block';
        isValid = false;
      } else {
        err.style.display = 'none';
      }
    }
    
    if (step === 3) {
      const descText = document.getElementById('booking_description').value.trim();
      const err = document.getElementById('error-step-3');
      if (descText === '') {
        err.style.display = 'block';
        isValid = false;
      } else {
        err.style.display = 'none';
      }
    }

    if (step === 4) {
      const name = document.getElementById('contact_name').value.trim();
      const email = document.getElementById('contact_email').value.trim();
      const phone = document.getElementById('contact_phone').value.trim();
      const timeSlot = document.querySelector('input[name="booking_time"]:checked');
      const dateSelected = document.querySelector('.cal-day.selected');
      const err = document.getElementById('error-step-4');

      if (name === '' || email === '' || phone === '' || !timeSlot || !dateSelected) {
        err.style.display = 'block';
        isValid = false;
      } else {
        err.style.display = 'none';
      }
    }

    return isValid;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }

  // Slider interactivo de medidas y visualizador a escala
  const dimensionSlider = document.getElementById('js-dimension-slider');
  const sliderValueText = document.getElementById('js-slider-value');
  const sizeBox = document.getElementById('js-size-box');

  if (dimensionSlider && sliderValueText && sizeBox) {
    const updateSizeIllustration = (value) => {
      sliderValueText.textContent = `${value} cm`;
      
      const basePx = 30;
      const maxPx = 170;
      const mappedPx = basePx + ((value - 3) / (40 - 3)) * (maxPx - basePx);
      
      const innerBox = sizeBox.querySelector('.size-box-inner');
      innerBox.style.width = `${mappedPx}px`;
      innerBox.style.height = `${mappedPx}px`;
      innerBox.textContent = `${value}cm`;
    };

    dimensionSlider.addEventListener('input', (e) => {
      updateSizeIllustration(e.target.value);
    });
    
    updateSizeIllustration(dimensionSlider.value);
  }

  // Mock de carga de imágenes (drag & drop)
  const dragDropArea = document.getElementById('js-drag-drop');
  const fileInput = document.getElementById('js-file-input');
  const filePreview = document.getElementById('js-file-preview');

  if (dragDropArea && fileInput && filePreview) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dragDropArea.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dragDropArea.classList.remove('dragover');
      }, false);
    });

    dragDropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    const handleFiles = (files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const item = document.createElement('div');
          item.className = 'file-preview-item';
          item.innerHTML = `
            <span>${file.name.substring(0, 15)}...</span>
            <button type="button">&times;</button>
          `;
          
          item.querySelector('button').addEventListener('click', () => {
            item.remove();
          });
          
          filePreview.appendChild(item);
        }
      }
    };
  }

  // Calendario Personalizado e Interactivo
  const calMonthText = document.getElementById('js-cal-month');
  const calDaysGrid = document.getElementById('js-cal-days');
  const calPrevBtn = document.getElementById('js-cal-prev');
  const calNextBtn = document.getElementById('js-cal-next');

  let currentDate = new Date(2026, 5, 1); // Empezamos en Junio 2026
  let selectedDateString = "";

  const renderCalendar = () => {
    calDaysGrid.innerHTML = "";
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    calMonthText.textContent = `${monthNames[month]} ${year}`;
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'cal-day empty';
      calDaysGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= lastDay; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day available';
      dayEl.textContent = day;
      
      const dayDate = new Date(year, month, day);
      const dayOfWeek = dayDate.getDay();
      
      if (dayOfWeek === 0) {
        dayEl.className = 'cal-day disabled';
        dayEl.title = 'Estudio cerrado';
      }
      
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr === selectedDateString) {
        dayEl.classList.add('selected');
      }
      
      dayEl.addEventListener('click', () => {
        document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
        dayEl.classList.add('selected');
        selectedDateString = dateStr;
        
        updateSummaryPreview();
      });
      
      calDaysGrid.appendChild(dayEl);
    }
  };

  if (calDaysGrid) {
    renderCalendar();
    
    calPrevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    
    calNextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Previsualización de resumen en Paso 4
  const updateSummaryPreview = () => {
    const style = document.querySelector('input[name="booking_style"]:checked')?.value || "-";
    const zone = document.querySelector('input[name="body_placement"]:checked')?.value || "-";
    const dim = dimensionSlider?.value || "15";
    
    document.getElementById('summary-style').textContent = style;
    document.getElementById('summary-size').textContent = `${zone} (${dim}cm)`;
    
    if (selectedDateString) {
      const [y, m, d] = selectedDateString.split('-');
      document.getElementById('summary-date').textContent = `${d}/${m}/${y}`;
    } else {
      document.getElementById('summary-date').textContent = "-";
    }
  };

  // Envío final del Formulario
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validateStep(4)) return;
      
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText ? submitBtnText.textContent : 'Confirmar Reserva';
      
      // Mostrar estado de carga
      if (submitBtnText) submitBtnText.textContent = 'Procesando...';
      submitBtn.disabled = true;
      
      const time = document.querySelector('input[name="booking_time"]:checked').value;
      const style = document.querySelector('input[name="booking_style"]:checked')?.value || "";
      const placement = document.querySelector('input[name="body_placement"]:checked')?.value || "";
      const size = parseInt(dimensionSlider?.value || "15", 10);
      const description = document.getElementById('booking_description').value.trim();
      const name = document.getElementById('contact_name').value.trim();
      const email = document.getElementById('contact_email').value.trim();
      const phone = document.getElementById('contact_phone').value.trim();
      
      const code = 'MGI-' + Math.floor(1000 + Math.random() * 9000);
      
      try {
        const { error } = await supabaseClient
          .from('reservas')
          .insert([
            {
              code: code,
              style: style,
              placement: placement,
              size: size,
              description: description,
              name: name,
              email: email,
              phone: phone,
              date: selectedDateString,
              time: time
            }
          ]);
          
        if (error) {
          console.error("Error guardando en Supabase:", error);
          alert("No se pudo registrar la reserva en la base de datos. Por favor, revisa la consola o la configuración de RLS de tu tabla.");
          
          if (submitBtnText) submitBtnText.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }
        
        // Mostrar pantalla de éxito si la base de datos respondió OK
        bookingForm.style.display = 'none';
        bookingSuccess.classList.add('active');
        
        document.getElementById('success-code').textContent = code;
        
        const [y, m, d] = selectedDateString.split('-');
        document.getElementById('success-datetime').textContent = `${d}/${m}/${y} a las ${time} hs`;
        
      } catch (err) {
        console.error("Error inesperado de conexión:", err);
        alert("Ocurrió un error al intentar conectar con la base de datos de Supabase.");
        
        if (submitBtnText) submitBtnText.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
    
    const resetBookingBtn = document.getElementById('js-reset-booking-btn');
    if (resetBookingBtn) {
      resetBookingBtn.addEventListener('click', () => {
        bookingForm.reset();
        selectedDateString = "";
        filePreview.innerHTML = "";
        
        dimensionSlider.value = 15;
        dimensionSlider.dispatchEvent(new Event('input'));
        
        currentStep = 1;
        updateProgress();
        showStepPane();
        
        bookingForm.style.display = 'block';
        bookingSuccess.classList.remove('active');
      });
    }
  }

  // ==========================================================================
  // 5. INYECCIÓN DINÁMICA DE METADATOS LOCALBUSINESS SCHEMA (SEO EXPERT)
  // ==========================================================================
  const injectSEO = () => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TattooParlor",
      "name": "Tattoo Magink",
      "image": "https://tattoomagink.com/images/tattoo_blackwork.png",
      "@id": "https://tattoomagink.com/#studio",
      "url": "https://tattoomagink.com",
      "telephone": "+541198765432",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Estudio Privado en Palermo",
        "addressLocality": "Ciudad Autónoma de Buenos Aires",
        "addressRegion": "CABA",
        "postalCode": "C1425",
        "addressCountry": "AR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -34.588889,
        "longitude": -58.430556
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "11:00",
          "closes": "20:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com",
        "https://www.tiktok.com",
        "https://www.pinterest.com"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  };
  
  injectSEO();
});
