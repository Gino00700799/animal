# 🐂 Calculadora de Dietas para Ganado Vacuno de Carne

Una aplicación web moderna para formular dietas balanceadas de ganado vacuno de carne machos según categorías de producción. Usa requerimientos nutricionales y composiciones de ingredientes derivados de fuentes de la FAO y de publicaciones universitarias.

## 🎯 Objetivo

Crear un software capaz de calcular y proponer raciones para diferentes categorías de machos de ganado vacuno de carne (becerros destetados, toretes, novillos, novillos en terminación y toros adultos). El usuario puede ingresar peso, edad, raza, ganancia diaria deseada, y seleccionar ingredientes disponibles. La aplicación calcula el requerimiento de energía, proteína, calcio y fósforo usando fórmulas de la FAO y tablas de la NAS/OSU y determina cantidades de ingredientes que satisfacen esos requerimientos.

## 📦 Características

### Calculadora Básica 🐄
- **Selección por países y razas**: Amplia base de datos de razas bovinas organizadas por región
- **Cálculos FAO estándar**: Implementa fórmulas oficiales de energía metabolizable
- **Interfaz multiidioma**: Soporte para español, inglés y alemán
- **Visualizaciones interactivas**: Gráficos con Recharts para análisis nutricional

### Calculadora FAO Profesional 🐂
- **Categorías FAO estándar**: 5 categorías de machos de carne con rangos predeterminados
- **Cálculo de requerimientos científicos**: Basado en fórmulas FAO para mantenimiento y crecimiento
- **Base de ingredientes clasificada**: Ingredientes según sistema internacional FAO
- **Optimización de dietas**: Algoritmo de programación lineal para minimizar costos
- **Validación nutricional**: Verificación automática de adecuación de nutrientes

## 🧮 Fórmulas FAO Implementadas

### Energía para mantenimiento (NEₘ)
```
Em = 0.293 × W^0.75 MJ NE/día
ME = Em / 0.67 (conversión a energía metabolizable)
```

### Energía para actividad
```
Ef = 1.8/1000 × W × d (MJ ME/día)
```
Donde d es la distancia diaria recorrida (km).

### Energía para crecimiento
```
MEg = 16 × g (MJ ME/día)
```
Donde g es la ganancia diaria deseada (kg/día).

### Energía total
```
ME_total = ME_m + E_f + ME_g
```

## 🐄 Categorías de Animales

| Categoría | Peso (kg) | Edad (meses) | Ganancia (kg/día) |
|-----------|-----------|--------------|-------------------|
| Becerro destetado | 150-250 | 4-8 | 0.5-0.7 |
| Torete | 250-350 | 8-14 | 0.7-0.9 |
| Novillo | 350-450 | 14-20 | 0.9-1.0 |
| Novillo final | 450-650 | 20-24 | 1.0-1.2 |
| Toro adulto | >650 | >24 | 0 (mantenimiento) |

## 🌐 Tecnologías

### Frontend
- **React 18** – Biblioteca para interfaces reactivas
- **Tailwind CSS** – Utilidades CSS para diseño responsive
- **Recharts** – Gráficos interactivos
- **Lucide React** – Íconos modernos

### Características Técnicas
- **Optimización de dietas**: Algoritmo secuencial para minimizar costos
- **Interpolación nutricional**: Cálculos precisos para pesos intermedios
- **Validación en tiempo real**: Verificación automática de restricciones
- **Exportación de reportes**: Generación de informes detallados

## 🚀 Instalación y Uso

### Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd calculadora-dietas-ganado
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm start
```

### 4. Abrir la aplicación
- Frontend: http://localhost:3000

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── FAOCategorySelector.js      # Selector de categorías FAO
│   ├── FAOAnimalForm.js            # Formulario de datos del animal
│   ├── FAOIngredientSelector.js    # Selector de ingredientes
│   ├── FAODietCalculator.js        # Calculadora principal FAO
│   ├── FAOResultsDisplay.js        # Visualización de resultados
│   └── [otros componentes...]
├── data/
│   ├── faoCategories.js            # Categorías FAO de animales
│   ├── faoIngredients.js           # Base de datos de ingredientes
│   ├── cattleBreeds.js             # Razas de ganado por país
│   └── cattleNutrition.js          # Datos nutricionales
├── utils/
│   ├── faoCalculations.js          # Cálculos según estándares FAO
│   ├── dietOptimization.js         # Optimización de dietas
│   └── calculations.js             # Cálculos básicos
└── contexts/
    └── LanguageContext.js          # Contexto multiidioma
```

## 🔧 Funcionalidades Principales

### Calculadora Básica
1. **Selección de país y raza**
2. **Ingreso de datos del animal** (peso, altura, edad)
3. **Cálculo automático** de requerimientos energéticos
4. **Visualización de resultados** con gráficos interactivos

### Calculadora FAO Profesional
1. **Selección de categoría FAO** según propósito productivo
2. **Configuración detallada** del animal y condiciones
3. **Selección de ingredientes** disponibles por categorías
4. **Optimización automática** de la dieta
5. **Validación nutricional** y recomendaciones
6. **Exportación de reportes** detallados

## 📚 Base Científica

### Fuentes de Referencia
- **FAO Animal Production and Health Paper 1** (2001, 2004) - Fórmulas de energía
- **NASEM/Oklahoma State University** - Tablas de requerimientos nutricionales
- **FutureBeef Australia** - Composición de ingredientes
- **Sistema de Clasificación FAO** - Categorización de alimentos

### Validación
- Requerimientos mínimos: 90% de adecuación energética y proteica
- Límites máximos: Prevención de excesos costosos (>120% energía, >130% proteína)
- Restricciones fisiológicas: Límites por categoría de ingrediente según peso corporal

## 🙏 Agradecimientos

- **FAO** – Por las fórmulas y conceptos de nutrición de rumiantes
- **Oklahoma State University** – Por las tablas de requerimientos nutricionales
- **FutureBeef** – Por la base de datos de composición de ingredientes

## ⚠️ Advertencias

- Esta herramienta es para fines educativos y de apoyo técnico
- Las raciones formuladas deben ser revisadas por un profesional en nutrición animal
- La composición de ingredientes puede variar según origen y condiciones de almacenamiento
- Se recomienda análisis de laboratorio para ingredientes cuando sea posible

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la comunidad ganadera**