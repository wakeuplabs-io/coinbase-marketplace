# Prompt para Implementar Nuevos Mockups/Wireframes

Usa este prompt cuando tengas un nuevo mockup o wireframe y quieras mantener el estilo consistente del Coinbase Marketplace.

---

## PROMPT PARA IMPLEMENTACIÓN DE UI

```
Implementa este wireframe/mockup manteniendo el sistema de diseño y estilo visual del Coinbase Marketplace existente. Sigue estas especificaciones exactas:

### SISTEMA DE DISEÑO

**Colores:**
- Primario/Acento: #0052FF (azul Coinbase)
- Fondo: #FFFFFF
- Texto principal: #0a0b0d
- Texto secundario/muted: #4a5568 o #5b616e
- Bordes: #e2e4e9
- Fondo de cards: #f9fafb o gradiente from-[#f8fafc] to-white

**Tipografía:**
- Fuente: Inter (de Google Fonts)
- Títulos: font-semibold con tracking-tight
- Tamaños responsivos: text-2xl sm:text-3xl lg:text-5xl para h1
- Leading: leading-tight para títulos, leading-relaxed para párrafos

**Espaciado:**
- Padding horizontal: px-5 md:px-8
- Padding vertical: py-8 lg:py-0 (ajustar según contexto)
- Gaps: gap-3, gap-4, gap-8, gap-16 según escala
- Max width containers: max-w-5xl o max-w-6xl con mx-auto

**Componentes Base:**

1. **Botones Primarios:**
   - bg-[#0a0b0d] text-white rounded-xl
   - px-5 py-3.5 (mobile) o px-4 py-2.5 (desktop)
   - hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98]
   - font-semibold text-sm

2. **Botones Secundarios:**
   - border border-[#0052ff]/20 text-[#0052ff] rounded-xl
   - hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]
   - font-medium

3. **Cards:**
   - bg-white border border-[#e2e4e9] rounded-2xl
   - shadow-sm (opcional)
   - p-6 o p-8 según tamaño
   - Hover: box-shadow con glow sutil si aplica

4. **Badges:**
   - px-2.5 py-1 text-xs font-medium
   - bg-[#0052ff]/10 text-[#0052ff] rounded-full

**Animaciones:**

1. **Fade-in-up:** Para elementos que aparecen al cargar
   - Clase: animate-fade-in-up
   - Delays: delay-100, delay-200, delay-300

2. **Arrow animation:** En enlaces con íconos de flecha
   - Clase: arrow-animate dentro de un group
   - Hover: translateX(4px)

3. **Shimmer effect:** Para palabras destacadas (ej: "Instantly")
   - Clase: instantly-shimmer
   - Color azul con efecto de brillo animado

4. **Hover effects:** 
   - Scale sutil: hover:scale-[1.02] active:scale-[0.98]
   - Transiciones suaves: transition-all

**Layout Responsive:**

- Mobile-first approach
- Grid: grid-cols-1 lg:grid-cols-2 para layouts de dos columnas
- Orden: order-1, order-2 para cambiar orden en mobile
- Ocultar/mostrar: hidden lg:block o lg:hidden según necesidad
- Flex: flex flex-col lg:flex-row según contexto

**Accesibilidad:**

- Incluir aria-label en todos los enlaces e íconos
- Skip to main content link (sr-only focus:not-sr-only)
- Focus visible con outline azul
- aria-hidden="true" en íconos decorativos

**Estructura:**

- Header: border-b border-[#e2e4e9], h-16, max-w-6xl mx-auto
- Footer: border-t border-[#e2e4e9], h-14, mismo max-width
- Main: flex-1 con padding responsivo

**Stack Tecnológico:**

- Next.js 16+ con App Router
- TypeScript
- Tailwind CSS v4
- React 19+
- Componentes como "use client" cuando sea necesario

### INSTRUCCIONES ESPECÍFICAS:

1. Analiza el wireframe/mockup proporcionado
2. Implementa los componentes manteniendo el sistema de diseño arriba
3. Usa las mismas clases de Tailwind y patrones de código
4. Mantén la consistencia visual con el diseño existente
5. Asegura que sea completamente responsive
6. Incluye todas las animaciones y efectos hover apropiados
7. Agrega accesibilidad (aria-labels, focus states, etc.)
8. Usa variables de entorno para URLs configurables (NEXT_PUBLIC_*)
9. Mantén el código limpio y bien estructurado
10. Si hay íconos, crea componentes SVG inline como en el código existente

### ESTRUCTURA DE ARCHIVOS:

- Componentes reutilizables en archivos separados si son complejos
- SVG icons como funciones componentes inline
- Estilos globales en globals.css
- Variables de entorno en .env.local

Implementa el wireframe siguiendo estas especificaciones exactas.
```

---

## CÓMO USAR ESTE PROMPT

1. **Copia el prompt completo** de arriba
2. **Adjunta o describe tu wireframe/mockup**
3. **Pega el prompt** junto con la imagen o descripción
4. El resultado mantendrá el estilo visual consistente del Coinbase Marketplace

## EJEMPLO DE USO

```
[PEGAR EL PROMPT DE ARRIBA]

Aquí está el wireframe que quiero implementar:
[adjuntar imagen o describir el mockup]

Mantén el mismo estilo visual y sistema de diseño del sitio actual.
```
