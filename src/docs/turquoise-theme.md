# Tema Turquesa - Documentación

## Paleta de Colores Base

Este tema se basa en el color principal **#029398** (turquesa/verde azulado) y una paleta de colores armónica que incluye variaciones desde tonos muy suaves hasta oscuros.

### Colores Principales

- **Color Base**: `#029398` - Turquesa/verde azulado principal
- **Muy Suaves**: 
  - `#E6F5F5` - Fondo principal del sistema
  - `#C5EBEC` - Áreas secundarias, tarjetas
  - `#A3E1E2` - Elementos sutiles
- **Suaves**:
  - `#81D7D9` - Elementos secundarios
  - `#5FCDCF` - Bordes, separadores
  - `#3DC3C6` - Acentos suaves
- **Medios**:
  - `#1BB9BC` - Variación media
  - `#029398` - Color principal
  - `#01868A` - Variación media oscura
- **Intermedios**:
  - `#01797D` - Barra lateral, navegación
  - `#016C70` - Elementos de navegación
  - `#016063` - Transiciones
- **Oscuros**:
  - `#015357` - Áreas enfatizadas
  - `#01464A` - Textos principales
  - `#01393C` - Títulos, elementos importantes

### Colores Complementarios

- `#FF9E6D` - Coral (acentos, destacados)
- `#FFD166` - Amarillo ámbar (alertas, notificaciones)
- `#7E62A3` - Púrpura (elementos especiales, categorías)
- `#F25757` - Rojo coral (errores, alertas críticas)

## Implementación OKLCH

Los colores han sido convertidos al formato OKLCH para mayor fidelidad de color y compatibilidad con el sistema de diseño existente.

### Modo Claro
- Fondo principal: `oklch(0.95 0.03 190)` - Equivalente a #E6F5F5
- Color primario: `oklch(0.55 0.15 190)` - Equivalente a #029398
- Elementos secundarios: `oklch(0.85 0.10 190)` - Equivalente a #81D7D9
- Texto: `oklch(0.25 0.05 190)` - Equivalente a #01393C (oscuro)

### Modo Oscuro (Mejorado)
- Fondo principal: `oklch(0.20 0.04 200)` - Versión más oscura y profunda del turquesa
- Texto: `oklch(0.85 0.04 190)` - Tono suave turquesa para reducir fatiga visual (no blanco puro)
- Color primario: `oklch(0.60 0.12 199.06)` - Turquesa vibrante con buena legibilidad
- Elementos destacados: `oklch(0.80 0.10 86.06)` - Ámbar suavizado para acentos
- Barra lateral: `oklch(0.15 0.03 200)` - Versión muy oscura del turquesa

#### Beneficios del modo oscuro mejorado
- Contraste reducido pero suficiente para mejorar la legibilidad
- Menos fatiga visual en sesiones largas
- Textos con suave tinte turquesa en lugar de blanco puro
- Jerarquía visual más clara entre elementos
- Bordes e inputs más visibles sin ser intrusivos

## Aplicación en la Interfaz de Usuario

### Dashboard / Panel Principal
- Fondo general: Muy suave (#E6F5F5)
- Barra de navegación: Color base (#029398) o intermedio (#01797D)
- Tarjetas/widgets: Blanco con bordes suaves
- Gráficos: Utilizar la paleta de 5 colores definida para gráficos
- Botones principales: Color base (#029398)
- Botones secundarios: Tonos suaves (#5FCDCF)
- Alertas: Utilizar colores complementarios según el tipo (éxito, advertencia, error)

### Sistema de Ventas
- Estados de reservas:
  - Confirmadas: #029398 (base)
  - Pendientes: #FFD166 (amarillo ámbar)
  - Canceladas: #F25757 (rojo coral)
  - Completadas: #01464A (oscuro)

- Categorías de productos/servicios:
  - Usar variaciones de la paleta para diferenciar categorías
  - Mantener consistencia visual con el resto del sistema
