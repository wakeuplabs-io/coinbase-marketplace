# Prompt para Implementar Nuevos Mockups/Wireframes - Coca-Cola App

Usa este prompt cuando tengas un nuevo mockup o wireframe y quieras mantener el estilo consistente de la aplicación Coca-Cola.

---

## PROMPT PARA IMPLEMENTACIÓN DE UI

```
Implementa este wireframe/mockup manteniendo el sistema de diseño y estilo visual de la aplicación Coca-Cola. Sigue estas especificaciones exactas:

### SISTEMA DE DISEÑO

**Colores:**
- Primario/Brand: #F40009 (rojo Coca-Cola)
- Secundario: #000000 (negro intenso)
- Acento: #FFFFFF (blanco puro)
- Fondo principal: #FFFFFF o #F8F8F8 (gris muy claro)
- Fondo alternativo: #000000 (para secciones de alto impacto)
- Texto principal: #000000
- Texto sobre rojo: #FFFFFF
- Texto secundario/muted: #6B6B6B o #8C8C8C
- Bordes sutiles: #E5E5E5 o #D4D4D4
- Overlay oscuro: rgba(0, 0, 0, 0.6) para efectos de superposición

**Colores de Productos (opcional para variantes):**
- Coca-Cola Original: #F40009
- Coca-Cola Zero: #000000 con detalles en #E31937
- Diet Coke: #C0C0C0 con detalles en #E8E8E8
- Sprite: #00B140 (verde limón)
- Fanta: #FF8300 (naranja)

**Tipografía:**
- Fuente principal: 'TCCC Unity' (o fallback: 'Gotham', 'Helvetica Neue', 'Arial', sans-serif)
- Títulos hero: font-bold text-5xl lg:text-7xl tracking-tight (siempre mayúsculas para impacto)
- Subtítulos: font-semibold text-2xl lg:text-4xl
- Body: font-normal text-base lg:text-lg leading-relaxed
- Llamados a la acción: font-bold uppercase tracking-wide text-sm lg:text-base

**Espaciado:**
- Padding horizontal: px-4 md:px-8 lg:px-12
- Padding vertical: py-6 md:py-12 lg:py-16 (generoso, aire respirable)
- Gaps: gap-4, gap-6, gap-8, gap-12 (escalado generoso)
- Max width containers: max-w-7xl mx-auto
- Secciones hero: min-h-screen con py-20 lg:py-24

**Componentes Base:**

1. **Botones Primarios (CTA Principal):**
   - bg-[#F40009] text-white rounded-full
   - px-8 py-4 lg:px-10 lg:py-5
   - hover:bg-[#D00008] transition-all duration-300
   - hover:scale-105 active:scale-95
   - font-bold uppercase tracking-wide text-sm lg:text-base
   - shadow-lg hover:shadow-xl
   - Con efecto de brillo opcional: after:absolute after:inset-0 after:rounded-full after:opacity-0 hover:after:opacity-20 after:bg-white

2. **Botones Secundarios:**
   - bg-black text-white rounded-full
   - hover:bg-[#1a1a1a] transition-all
   - Mismo padding y efectos que primario
   - font-semibold uppercase

3. **Botones Outlined:**
   - border-2 border-[#F40009] text-[#F40009] bg-transparent rounded-full
   - hover:bg-[#F40009] hover:text-white transition-all duration-300
   - font-bold uppercase

4. **Cards:**
   - bg-white rounded-3xl lg:rounded-[2rem]
   - shadow-md hover:shadow-2xl transition-shadow duration-300
   - overflow-hidden
   - p-6 lg:p-8
   - border opcional: border border-[#E5E5E5]
   - Hover: transform hover:scale-[1.02] transition-transform

5. **Badges/Pills:**
   - px-4 py-2 text-xs font-bold uppercase
   - bg-[#F40009] text-white rounded-full
   - O variante invertida: bg-white text-[#F40009] border border-[#F40009]

6. **Hero Sections:**
   - Background: bg-gradient-to-br from-[#F40009] via-[#E31937] to-[#C00008]
   - O alternativa: bg-black con elementos rojos
   - min-h-screen flex items-center
   - Overlay con textura de burbujas (opcional, usando SVG pattern)
   - Text: text-white con drop-shadow

**Elementos Visuales Característicos:**

1. **Onda Dinámica (Dynamic Ribbon):**
   - SVG curvo que fluye horizontalmente
   - Color: #F40009 o white según fondo
   - Animar con CSS: animate-wave
   - Usar como separador de secciones

2. **Burbujas (Bubbles):**
   - Círculos con gradiente radial
   - Animación: float-up con blur
   - Posicionamiento absoluto con z-index bajo
   - Tamaños variados: w-20 a w-96

3. **Botella Contour (Silueta icónica):**
   - SVG o imagen PNG con transparencia
   - Usar como elemento decorativo en hero sections
   - Rotate o tilt sutil: transform rotate-6
   - Parallax effect opcional

4. **Gotas de Condensación:**
   - Pequeños elementos circulares con blur
   - position: absolute
   - Animación: drip-down

**Animaciones:**

1. **Entrada de Hero:**
   - Fade-in-up para texto: animate-fade-in-up
   - Delays escalonados: delay-100, delay-200, delay-300
   - Scale-in para elementos visuales: animate-scale-in

2. **Bubbles Float:**
   - Animación continua hacia arriba
   - Duración: 8s a 15s
   - Easing: ease-in-out
   - transform: translateY(-100vh)

3. **Hover en Cards:**
   - Scale: hover:scale-[1.02]
   - Shadow lift: shadow-md → shadow-2xl
   - Duration: 300ms

4. **Shimmer Effect (Brillo):**
   - Para CTAs y elementos destacados
   - Gradiente lineal animado que recorre el elemento
   - animation: shimmer 2s infinite

5. **Parallax Scroll:**
   - Para botellas y elementos decorativos
   - Movimiento sutil al hacer scroll
   - transform: translateY(scrollY * 0.5)

**Layout Responsive:**

- Mobile-first approach
- Hero sections: stack vertical en mobile, horizontal en desktop
- Grid de productos: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Imágenes de productos: aspect-square o aspect-[3/4]
- Typography scale: ajustar agresivamente entre mobile y desktop
- Espaciado reducido en mobile: py-8 mobile vs py-20 desktop

**Accesibilidad:**

- Alto contraste: rojo sobre blanco, blanco sobre rojo, blanco sobre negro
- Focus visible: outline-2 outline-offset-2 outline-[#F40009]
- aria-label en todos los botones e íconos
- Alt text descriptivo en todas las imágenes de productos
- Skip to main content link
- Mínimo WCAG AA compliance

**Estructura de Página:**

1. **Header:**
   - Sticky: sticky top-0 z-50
   - bg-white border-b border-[#E5E5E5]
   - h-16 lg:h-20
   - Logo rojo a la izquierda, nav centrado o derecha
   - Backdrop blur en scroll: backdrop-blur-md bg-white/90

2. **Hero Section:**
   - min-h-screen con background gradient o imagen
   - Centrado vertical y horizontal
   - CTA prominente
   - Elemento visual (botella) con parallax

3. **Product Showcase:**
   - Grid de productos con hover effects
   - Imágenes sobre fondo blanco o transparente
   - Nombres en bold, descripción en regular

4. **Footer:**
   - bg-black text-white
   - py-12 lg:py-16
   - Grid con links, redes sociales, legal
   - Logo en blanco

**Stack Tecnológico:**

- Next.js 16+ con App Router
- TypeScript
- Tailwind CSS v4
- React 19+
- Framer Motion (opcional, para animaciones complejas)
- Componentes como "use client" cuando sea necesario

**Recursos Visuales:**

- Logo oficial de Coca-Cola (SVG rojo y blanco)
- Tipografía TCCC Unity (o Gotham como fallback)
- Imágenes de productos sobre fondo transparente
- Íconos: línea simple, estilo moderno, consistentes
- Texturas: burbujas, gotas, ondas (SVG patterns)

### INSTRUCCIONES ESPECÍFICAS:

1. Analiza el wireframe/mockup proporcionado
2. Implementa con el sistema de diseño Coca-Cola arriba
3. Usa rojo (#F40009) como color dominante en CTAs y acentos
4. Espaciado generoso, breathing room
5. Tipografía bold y en mayúsculas para títulos impactantes
6. Incorpora elementos visuales característicos (burbujas, ondas)
7. Animaciones suaves y elegantes, no exageradas
8. Asegura contraste alto para legibilidad
9. Responsive con enfoque mobile-first
10. Celebratorio, optimista, nostálgico pero moderno

### ESTRUCTURA DE ARCHIVOS:

- /components/CocaColaButton.tsx (botones con estilo de marca)
- /components/BubbleBackground.tsx (efecto de burbujas)
- /components/WaveSection.tsx (divisor con onda)
- /components/ProductCard.tsx (card de producto)
- /public/logos/ (logos en diferentes variantes)
- /public/products/ (imágenes de productos)
- globals.css con animaciones custom (@keyframes)
- Variables de entorno en .env.local

### TONO Y PERSONALIDAD:

- Alegre, optimista, nostálgico
- Celebratorio de momentos compartidos
- Icónico y atemporal
- Inclusivo y universal
- "Open Happiness" / "Taste the Feeling"

Implementa el wireframe siguiendo estas especificaciones exactas para crear una experiencia visual auténticamente Coca-Cola.
```

---

## CÓMO USAR ESTE PROMPT

1. **Copia el prompt completo** de arriba
2. **Adjunta o describe tu wireframe/mockup**
3. **Especifica el tipo de página** (landing, tienda, promoción, etc.)
4. El resultado mantendrá el estilo visual icónico de Coca-Cola

## EJEMPLO DE USO

```
[PEGAR EL PROMPT DE ARRIBA]

Aquí está el wireframe que quiero implementar:
[adjuntar imagen o describir el mockup]

Tipo de página: Landing page promocional para "Share a Coke" campaign
Objetivo: Captar emails y generar engagement en redes sociales

Mantén el estilo visual icónico de Coca-Cola con elementos nostálgicos pero modernos.
```

---

## PALETA DE COLORES (HEX)

```
Rojo Coca-Cola: #F40009
Negro:          #000000
Blanco:         #FFFFFF
Gris claro:     #F8F8F8
Gris medio:     #6B6B6B
Borde sutil:    #E5E5E5
```

## REFERENCIAS DE TIPOGRAFÍA

- **TCCC Unity:** Fuente corporativa oficial (requiere licencia)
- **Fallback Stack:** 'Gotham', 'Helvetica Neue', 'Arial', sans-serif
- **Alternativa Google Fonts:** 'Montserrat' (bold para títulos), 'Open Sans' (body)

## ELEMENTOS VISUALES CLAVE

1. **Logo:** Siempre en rojo sobre blanco o blanco sobre rojo/negro
2. **Botella Contour:** Silueta icónica como elemento decorativo
3. **Burbujas:** Círculos flotantes con animación ascendente
4. **Onda Dinámica:** Ribbon curvo rojo como separador
5. **Gotas:** Condensación para efectos de frescura
6. **Fotografía:** Lifestyle, momentos compartidos, felicidad genuina
