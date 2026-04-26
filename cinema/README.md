# 🎬 Cinema App — Frontend

Interfaz web para el sistema de gestión de cine.
Desarrollada con HTML, CSS y JavaScript puro, conectada a la Cinema API.

---

## 🧰 Tecnologías utilizadas

| Tecnología | Para qué sirve |
|---|---|
| HTML5 | Estructura de la página |
| CSS3 | Estilos y diseño visual |
| JavaScript | Lógica e interacción con la API |
| Fetch API | Comunicación HTTP con el backend |

---

## 📁 Estructura del proyecto

Frontend_Cine/
├── .github/
│   └── workflows/
│       └── ci.yml        → Job de validación automática
├── css/
│   └── styles.css        → Estilos globales
├── js/
│   ├── api.js            → Comunicación con el backend
│   ├── movies.js         → Lógica de películas
│   ├── clients.js        → Lógica de clientes
│   ├── rooms.js          → Lógica de salas
│   └── rentals.js        → Lógica de rentas
├── index.html            → Página principal
└── README.md             → Este archivo

---

## 🎯 Funcionalidades

- 📖 Documentación del sistema con glosario de términos
- 🎥 CRUD completo de películas
- 👤 CRUD completo de clientes
- 🎭 CRUD completo de salas de proyección
- 📋 CRUD completo de rentas
- ✅ Validación de formularios
- 🔔 Mensajes de éxito y error en tiempo real

---

## 🚀 Cómo ejecutar

### Prerrequisitos
- La base de datos debe estar corriendo (`docker-compose up`)
- La API debe estar corriendo (`mvn spring-boot:run`)

### Abrir el frontend
Simplemente abre el archivo `index.html` en tu navegador:

```bash
# Opción 1 — doble clic en index.html

# Opción 2 — desde terminal
start index.html        # Windows
open index.html         # Mac
xdg-open index.html     # Linux
```

---

## 🔗 Conexión con la API

El archivo `js/api.js` centraliza toda la comunicación.
Si cambias el puerto del backend, solo modifica esta línea:

```javascript
const API_URL = "http://localhost:8080/api/v1";
```

---

## 🔑 Glosario de términos

| Término | Significado |
|---|---|
| API | Application Programming Interface — interfaz para comunicar sistemas |
| Endpoint | Punto de acceso de la API (una URL específica) |
| CRUD | Create, Read, Update, Delete — operaciones básicas |
| Fetch | Función de JS para hacer peticiones HTTP |
| UUID | Identificador único universal |
| Stock | Cantidad de copias disponibles de una película |
| Rental | Renta — registro de una película tomada por un cliente |
| Screening Room | Sala de proyección del cine |

---

## ⚙️ CI/CD con GitHub Actions

El archivo `.github/workflows/ci.yml` valida automáticamente que:
- Los archivos HTML tienen estructura correcta
- Los archivos JS no tienen errores de sintaxis
- La estructura de carpetas está completa

Se ejecuta en cada push a `main` o `develop`.