/* ==========================================================================
   THE INK LAB CREATIVE STUDIO - MOTOR DE CANVAS (FABRIC.JS & FLUX AI)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 0. CURSOR PERSONALIZADO (DOT & FOLLOWER)
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
  }

  // ==========================================================================
  // 1. INICIALIZACIÓN DE FABRIC.JS
  // ==========================================================================
  const canvasElement = document.getElementById('tattoo-canvas');
  const canvas = new fabric.Canvas('tattoo-canvas', {
    backgroundColor: '#ffffff',
    isDrawingMode: false,
    preserveObjectStacking: true
  });

  // Configuración por defecto de los controles de Fabric.js
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#00d0d2',
    cornerStrokeColor: '#ffffff',
    borderColor: '#00d0d2',
    cornerSize: 10,
    padding: 8,
    borderDashArray: [3, 3]
  });

  // ==========================================================================
  // 2. CONFIGURACIÓN DE SUPABASE
  // ==========================================================================
  const supabaseUrl = 'https://jfiysjwtsfqlaodxrtvf.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaXlzand0c2ZxbGFvZHhydHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzcyODIsImV4cCI6MjA5NzQxMzI4Mn0.qSrCd1lEogq9g_KMdJxbD6rkY8z0uLMDk8DKuS4-eco';
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  // ==========================================================================
  // 3. BARRA DE HERRAMIENTAS IZQUIERDA
  // ==========================================================================
  const btnSelect = document.getElementById('btn-select');
  const btnBrush = document.getElementById('btn-brush');
  const btnAddText = document.getElementById('btn-add-text');
  const brushSettingsPanel = document.getElementById('brush-settings');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeVal = document.getElementById('brush-size-val');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const localImageInput = document.getElementById('local-image-input');

  // Gestor del modo activo
  const setActiveTool = (activeButton) => {
    [btnSelect, btnBrush, btnAddText].forEach(btn => btn.classList.remove('active'));
    if (activeButton) activeButton.classList.add('active');
    
    // Ocultar paneles de ajustes por defecto
    brushSettingsPanel.style.display = 'none';
  };

  // Botón Seleccionar
  btnSelect.addEventListener('click', () => {
    setActiveTool(btnSelect);
    canvas.isDrawingMode = false;
  });

  // Botón Pincel
  btnBrush.addEventListener('click', () => {
    setActiveTool(btnBrush);
    canvas.isDrawingMode = true;
    brushSettingsPanel.style.display = 'flex';
    
    // Configurar pincel por defecto
    canvas.freeDrawingBrush.width = parseInt(brushSizeInput.value, 10);
    const activeColor = document.querySelector('.color-swatch.active').getAttribute('data-color');
    canvas.freeDrawingBrush.color = activeColor;
  });

  // Ajustes de Pincel (Tamaño)
  brushSizeInput.addEventListener('input', (e) => {
    const val = e.target.value;
    brushSizeVal.textContent = `${val}px`;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = parseInt(val, 10);
    }
  });

  // Ajustes de Pincel (Color)
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const color = swatch.getAttribute('data-color');
      
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
      }
    });
  });

  // Botón Añadir Texto
  btnAddText.addEventListener('click', () => {
    setActiveTool(btnSelect); // Volver al modo selección para editar el texto añadido
    canvas.isDrawingMode = false;
    
    const newText = new fabric.IText('Doble clic para editar', {
      left: 250,
      top: 300,
      fontSize: 48,
      fontFamily: 'Pirata One',
      fill: '#000000',
      editable: true
    });
    
    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
  });

  // Cargar Imagen Local
  localImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function() {
        const fabricImg = new fabric.Image(imgObj);
        
        // Redimensionar para que encaje cómodamente
        fabricImg.scaleToWidth(300);
        fabricImg.set({
          left: 250,
          top: 250
        });
        
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
    // Limpiar input para permitir recargar la misma imagen
    e.target.value = '';
  });

  // ==========================================================================
  // 4. PORTAL DE IA: FLUX & FILTRO REMOVER FONDO BLANCO (CROMATISMO)
  // ==========================================================================
  const aiApiKeyInput = document.getElementById('ai-api-key');
  const aiPromptTextarea = document.getElementById('ai-prompt');
  const btnGenerateAi = document.getElementById('btn-generate-ai');
  const aiRemoveBgCheckbox = document.getElementById('ai-remove-bg');
  const bgThresholdInput = document.getElementById('bg-threshold');
  const bgThresholdVal = document.getElementById('bg-threshold-val');
  const loadingOverlay = document.getElementById('js-studio-loading');
  const loadingMessage = document.getElementById('loading-message');

  // Configurar clave API por defecto hardcodeada
  const defaultApiKey = 'tgp_v1_OMdKzyfFBZwh_haCXGp9RRsmTi_ZkEKUmqiyn_-bbTs';
  if (!localStorage.getItem('together_ai_api_key')) {
    localStorage.setItem('together_ai_api_key', defaultApiKey);
  }
  aiApiKeyInput.value = localStorage.getItem('together_ai_api_key');

  // Guardar clave API en cambio
  aiApiKeyInput.addEventListener('change', (e) => {
    const val = e.target.value.trim();
    localStorage.setItem('together_ai_api_key', val || defaultApiKey);
  });

  // Actualizar indicador del Threshold
  bgThresholdInput.addEventListener('input', (e) => {
    bgThresholdVal.textContent = `${e.target.value}%`;
  });

  // Filtro de remoción de fondo blanco por análisis cromático en canvas temporal
  const processImageBackgroundRemoval = (imageElement, thresholdPercent) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = imageElement.naturalWidth || imageElement.width;
    tempCanvas.height = imageElement.naturalHeight || imageElement.height;
    
    tempCtx.drawImage(imageElement, 0, 0);
    
    const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;
    
    // Convertir porcentaje de tolerancia a diferencia cromática absoluta (0-255)
    // Un threshold del 20% significa que cualquier pixel con RGB mayor a 255 - (255 * 0.20) = 204 es blanco.
    const cutoff = 255 - (255 * (thresholdPercent / 100));
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      // Si el pixel es predominantemente blanco/brillante, lo hacemos transparente
      if (r >= cutoff && g >= cutoff && b >= cutoff) {
        data[i+3] = 0; // Canal Alpha a 0
      }
    }
    
    tempCtx.putImageData(imgData, 0, 0);
    return tempCanvas.toDataURL('image/png');
  };

  // Evento Generar IA
  btnGenerateAi.addEventListener('click', async () => {
    const apiKey = aiApiKeyInput.value.trim();
    const prompt = aiPromptTextarea.value.trim();
    
    if (!apiKey) {
      alert("Por favor, ingresa tu Together.ai API Key.");
      return;
    }
    if (!prompt) {
      alert("Por favor, escribe un prompt para generar el diseño.");
      return;
    }

    // Mostrar overlay de carga
    loadingOverlay.style.display = 'flex';
    loadingMessage.textContent = 'Traduciendo descripción al inglés...';
    btnGenerateAi.disabled = true;

    let translatedPrompt = prompt;
    try {
      const translateRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(prompt)}&langpair=es|en`);
      if (translateRes.ok) {
        const translateData = await translateRes.json();
        translatedPrompt = translateData.responseData?.translatedText || prompt;
        console.log("Original:", prompt);
        console.log("Traducido:", translatedPrompt);
      }
    } catch (err) {
      console.warn("Fallo en la traducción automática, usando el texto original:", err);
    }

    loadingMessage.textContent = 'Generando diseño con Flux AI...';

    const stylePreset = document.getElementById('ai-style-preset')?.value || 'stencil';
    
    let finalPrompt = translatedPrompt;
    if (stylePreset === 'stencil') {
      finalPrompt = `tattoo stencil style, line art vector, black ink on clean white background, ${translatedPrompt}`;
    } else if (stylePreset === 'color') {
      finalPrompt = `bold line neotraditional tattoo design, vibrant full color, clean white background, ${translatedPrompt}`;
    } else if (stylePreset === 'realistic') {
      finalPrompt = `black and grey realistic tattoo artwork, detailed shading, clean white background, ${translatedPrompt}`;
    } // Si es 'free', usa el prompt tal cual lo escribió el usuario

    try {
      const response = await fetch('https://api.together.xyz/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.1-schnell',
          prompt: finalPrompt,
          width: 768,
          height: 768,
          steps: 4,
          n: 1,
          response_format: 'b64_json'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Error en la API de Together.ai');
      }

      loadingMessage.textContent = 'Procesando imagen y limpiando fondo...';
      const data = await response.json();
      const base64Data = data.data[0].b64_json;
      const imgSrc = `data:image/jpeg;base64,${base64Data}`;
      
      // Cargar imagen en un objeto Image de HTML para el análisis
      const tempImg = new Image();
      tempImg.crossOrigin = "anonymous";
      tempImg.src = imgSrc;
      tempImg.onload = function() {
        let finalSrc = imgSrc;
        
        if (aiRemoveBgCheckbox.checked) {
          const threshold = parseInt(bgThresholdInput.value, 10);
          finalSrc = processImageBackgroundRemoval(tempImg, threshold);
        }
        
        // Inyectar en Fabric.js
        fabric.Image.fromURL(finalSrc, (fabricImg) => {
          fabricImg.scaleToWidth(400);
          fabricImg.set({
            left: 200,
            top: 200
          });
          
          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg);
          canvas.renderAll();
          
          // Ocultar loading
          loadingOverlay.style.display = 'none';
          btnGenerateAi.disabled = false;
        });
      };

    } catch (error) {
      console.error(error);
      alert(`Error al generar diseño: ${error.message}`);
      loadingOverlay.style.display = 'none';
      btnGenerateAi.disabled = false;
    }
  });

  // ==========================================================================
  // 5. INSPECTOR DE CAPAS Y PROPIEDADES (DERECHA CONTEXTUAL)
  // ==========================================================================
  const textPropertiesPanel = document.getElementById('text-properties');
  const fontFamilySelect = document.getElementById('font-family-select');
  const layerActiveControls = document.getElementById('layer-active-controls');
  const layerPlaceholder = document.getElementById('layer-placeholder');
  const layerOpacityInput = document.getElementById('layer-opacity');
  const layerOpacityVal = document.getElementById('layer-opacity-val');
  const btnBringFront = document.getElementById('btn-bring-front');
  const btnSendBack = document.getElementById('btn-send-back');
  const btnDeleteLayer = document.getElementById('btn-delete-layer');

  const updateInspectorUI = () => {
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      layerPlaceholder.style.display = 'none';
      layerActiveControls.style.display = 'block';
      
      // Opacidad
      const opVal = Math.round(activeObject.opacity * 100);
      layerOpacityInput.value = opVal;
      layerOpacityVal.textContent = `${opVal}%`;
      
      // Inspeccionar si es texto
      if (activeObject.type === 'i-text') {
        textPropertiesPanel.style.display = 'block';
        fontFamilySelect.value = activeObject.fontFamily;
      } else {
        textPropertiesPanel.style.display = 'none';
      }
    } else {
      layerPlaceholder.style.display = 'block';
      layerActiveControls.style.display = 'none';
      textPropertiesPanel.style.display = 'none';
    }
  };

  // Eventos de selección de Fabric.js
  canvas.on('selection:created', updateInspectorUI);
  canvas.on('selection:updated', updateInspectorUI);
  canvas.on('selection:cleared', updateInspectorUI);
  
  // Cambiar opacidad de capa activa
  layerOpacityInput.addEventListener('input', (e) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const op = parseInt(e.target.value, 10) / 100;
      activeObject.set('opacity', op);
      layerOpacityVal.textContent = `${e.target.value}%`;
      canvas.renderAll();
    }
  });

  // Cambiar fuente de texto
  fontFamilySelect.addEventListener('change', (e) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('fontFamily', e.target.value);
      canvas.renderAll();
    }
  });

  // Traer al frente
  btnBringFront.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringToFront(activeObject);
      canvas.renderAll();
    }
  });

  // Enviar al fondo
  btnSendBack.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendToBack(activeObject);
      // Evitar enviarlo detrás del fondo blanco puro por accidente
      canvas.renderAll();
    }
  });

  // Eliminar Capa
  btnDeleteLayer.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  });

  // Tecla Suprimir (Delete) para borrar capa activa
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Ignorar si el usuario está escribiendo en el texto de Fabric o en el prompt
      const activeObject = canvas.getActiveObject();
      const activeEl = document.activeElement;
      if (activeObject && activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA' && !activeObject.isEditing) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  });

  // ==========================================================================
  // 6. EXPORTAR / PUBLICAR PROYECTO
  // ==========================================================================
  const btnExportStencil = document.getElementById('btn-export-stencil');
  const btnPublishPortfolio = document.getElementById('btn-publish-portfolio');
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnLoadDraft = document.getElementById('btn-load-draft');

  // Descarga de Stencil PNG
  btnExportStencil.addEventListener('click', () => {
    // 1. Quitar selección para evitar que los controles celestes salgan en la foto
    canvas.discardActiveObject();
    canvas.renderAll();

    // 2. Apagar temporalmente el fondo blanco para obtener transparencia pura
    const originalBG = canvas.backgroundColor;
    canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));

    // 3. Renderizar y disparar descarga de alta calidad (multiplier: 2)
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    // Restaurar fondo original
    canvas.setBackgroundColor(originalBG, canvas.renderAll.bind(canvas));

    // Crear elemento anchor de simulación de descarga
    const link = document.createElement('a');
    link.download = `stencil-magink-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Guardar Borrador Local
  btnSaveDraft.addEventListener('click', () => {
    const jsonStr = JSON.stringify(canvas.toJSON());
    localStorage.setItem('ink_lab_studio_draft', jsonStr);
    alert("Borrador del diseño guardado localmente en tu navegador.");
  });

  // Cargar Borrador Local
  btnLoadDraft.addEventListener('click', () => {
    const jsonStr = localStorage.getItem('ink_lab_studio_draft');
    if (!jsonStr) {
      alert("No se encontró ningún borrador guardado en este navegador.");
      return;
    }
    
    canvas.loadFromJSON(jsonStr, () => {
      canvas.renderAll();
      alert("Borrador del diseño cargado exitosamente.");
    });
  });

  // Publicar al Portfolio (Supabase)
  btnPublishPortfolio.addEventListener('click', async () => {
    const confirmPublish = confirm("¿Estás seguro de publicar esta pieza directamente al portfolio live del estudio?");
    if (!confirmPublish) return;

    // Deseleccionar objetos
    canvas.discardActiveObject();
    canvas.renderAll();

    loadingOverlay.style.display = 'flex';
    loadingMessage.textContent = 'Exportando imagen y subiendo a base de datos...';
    btnPublishPortfolio.disabled = true;

    try {
      // Exportar en PNG base64
      const originalBG = canvas.backgroundColor;
      canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.9,
        multiplier: 1.5
      });
      canvas.setBackgroundColor(originalBG, canvas.renderAll.bind(canvas));

      // Extraer datos base64 para guardado
      const base64Clean = dataUrl.split(',')[1];
      const designCode = 'STUDIO-' + Math.floor(100 + Math.random() * 900);

      // Insertar metadata de diseño en la tabla Supabase 'portfolio_studio'
      const { data, error } = await supabaseClient
        .from('portfolio_studio')
        .insert([
          {
            code: designCode,
            image_base64: base64Clean,
            title: `Diseño de Autor ${designCode}`,
            artist: 'Marcus Magink'
          }
        ]);

      if (error) throw error;

      alert(`¡Diseño ${designCode} publicado con éxito! Ya está disponible en la base de datos y en el portfolio online.`);
      
    } catch (err) {
      console.error(err);
      alert(`Error al publicar diseño en Supabase: ${err.message}`);
    } finally {
      loadingOverlay.style.display = 'none';
      btnPublishPortfolio.disabled = false;
    }
  });

});
