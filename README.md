# TATTOO MAGINK - Premium Private Tattoo Studio & Gallery Website

Este proyecto representa la excelencia en diseño de interfaces de usuario (UI/UX) y optimización SEO local para un estudio privado y exclusivo de tatuajes de un solo artista y autor (**Tattoo Magink**). El diseño adopta una estética oscura absoluta con acentos cian neón y superposiciones de cuadrículas táctiles, cumpliendo con los estándares de calidad de plataformas como Awwwards y CSS Design Awards.

---

## 🚀 Arquitectura & Características del Sitio

1. **Vanilla Stack (Cero Sobrecarga)**: Desarrollado puramente con HTML5 semántico, CSS3 moderno (Custom Properties, Flexbox, Grid) y ES6 JavaScript modular. Sin frameworks innecesarios que degraden el rendimiento.
2. **Estética Awwwards Premium**: Fondo oscuro absoluto `#010101`, tipografía Serif elegante (*Cormorant Garamond*) combinada con Sans-Serif limpia (*Inter*), efectos de cursor personalizado e interacciones fluidas mediante transiciones de curva Bézier.
3. **Optimización de Medios (Lazy Loading)**: Las imágenes del portafolio se cargan bajo demanda utilizando `loading="lazy"` para agilizar la carga inicial.
4. **Embudo de Reserva Dinámico**: Formulario multietapa (wizard) interactivo de 4 pasos optimizado para un solo artista:
   - Paso 1: Selección de estilo.
   - Paso 2: Zona y tamaño (ilustrador dinámico a escala según los centímetros).
   - Paso 3: Detalles y referencias (zona drag-and-drop para bocetos de referencia).
   - Paso 4: Calendario interactivo de consulta privada y datos de contacto.
5. **SEO Local Avanzado**: Inyección dinámica en el encabezado de un marcado estructurado de datos JSON-LD de tipo `TattooParlor` (`LocalBusiness`) con coordenadas geográficas en Palermo (CABA) y horarios de atención privada.

---

## 🛠️ Cómo Ejecutar Localmente

Dado que el proyecto utiliza Javascript de cliente y recursos estáticos, puedes ejecutarlo de varias maneras:

### Opción 1: Servidor Node.js integrado
Hemos incluido un servidor estático rápido e inmune a las políticas de ejecución de scripts de Windows. Solo ejecuta:

```bash
node server.js
```
El servidor se iniciará en **http://localhost:8080/**.

### Opción 2: Extensiones del Editor
- En **VS Code**, puedes instalar la extensión **Live Server** de *Ritwick Dey*, hacer clic derecho en `index.html` y seleccionar *Open with Live Server*.

---

## 📈 Escalabilidad e Integración de Backend

Este sitio web está estructurado de manera modular, lo que facilita la conexión de sus interfaces con servicios externos de backend. Aquí te explicamos cómo realizar las integraciones clave:

### 1. Guardar Solicitudes de Cita en una Base de Datos (ej. Supabase o Firebase)
En el archivo `app.js`, dentro del evento `submit` del formulario (`bookingForm`), puedes enviar los datos mediante una solicitud HTTP `POST` a tu base de datos:

```javascript
// Ejemplo de conexión con Supabase en app.js
const submitBookingToDatabase = async (formData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        booking_code: formData.code,
        style: formData.style,
        body_placement: formData.placement,
        dimensions: formData.dimensions,
        description: formData.description,
        contact_name: formData.name,
        contact_email: formData.email,
        contact_phone: formData.phone,
        date: formData.date,
        time: formData.time
      }
    ]);
  
  if (error) console.error("Error guardando reserva:", error);
  return data;
};
```

### 2. Sincronización de Calendario Real (ej. Google Calendar o Cal.com API)
Dado que el estudio es 100% privado y atendido por un único artista, sincronizar la disponibilidad real es crítico:

- Integra la API de **Cal.com** o el **API de Google Calendar** a través de tu backend.
- En lugar de renderizar días estáticos en `renderCalendar()`, haz un `fetch` previo para traer las fechas y horas reales en las que Marcus tiene citas y deshabilítalas dinámicamente en el calendario del frontend.
