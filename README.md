# 🍲 REDETAS

> **UNA RED SOCIAL INCLUSIVA PARA DIETAS ESPECIALIZADAS**
> *Proyecto desarrollado como Trabajo de Fin de Grado (TFG) - Desarrollo de Aplicaciones Web.*

## 📖 Sobre el proyecto

**REDETAS** es una plataforma web (Single Page Application) diseñada para facilitar la vida a personas con necesidades dietéticas especiales (celiaquía, alergias, intolerancias, etc.). 

El objetivo principal es crear una comunidad donde los usuarios puedan compartir, buscar y guardar recetas con la seguridad de que los filtros de alérgenos (sin gluten, sin huevo, sin lactosa, etc.) funcionan de forma precisa e intuitiva.

## ✨ Funcionalidades Principales

- **Catálogo Dinámico:** Visualización del feed de recetas con renderizado condicional de iconos de alérgenos.
- **Sistema CRUD Completo:** - **Crear:** Publicación de recetas obligando a la categorización de la dieta.
  - **Leer:** Carga asíncrona de datos desde la base de datos MongoDB.
  - **Actualizar:** Edición en tiempo real ("Estado Controlado") sin salir de la tarjeta de la receta.
  - **Borrar:** Eliminación de registros con alertas nativas de seguridad.
- **Diseño Responsive:** Interfaz adaptada a dispositivos móviles priorizando la experiencia de usuario (UX) e interfaz de usuario (UI), utilizando Flexbox y CSS Grid.

## 🛠️ Tecnologías Utilizadas (MERN Stack)

El proyecto está construido bajo una arquitectura Cliente-Servidor separada en tres capas:

**Frontend (Capa de Presentación):**
- React.js (Hooks, React Router DOM)
- CSS3 puro (Flexbox / CSS Grid)
- Axios (Cliente HTTP)

**Backend (Capa Lógica):**
- Node.js
- Express.js
- CORS & Dotenv

**Base de Datos (Capa de Persistencia):**
- MongoDB
- Mongoose (Modelado de objetos)

## 🚀 Instalación y Despliegue Local

Para correr este proyecto en tu máquina local, necesitas tener instalado [Node.js](https://nodejs.org/) y [MongoDB](https://www.mongodb.com/).

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/Bat-seba/redetas.git
cd redetas
\`\`\`

### 2. Configurar el Backend
\`\`\`bash
cd backend
npm install
\`\`\`
*Crea un archivo `.env` en la carpeta `backend` y añade tu URI de conexión a MongoDB y el puerto:*
\`\`\`env
PORT=3000
MONGO_URI=mongodb://localhost:27017/redetas_db
\`\`\`
*Inicia el servidor:*
\`\`\`bash
npm start
\`\`\`

### 3. Configurar el Frontend
Abre una nueva terminal y ejecuta:
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`
La aplicación se abrirá automáticamente en `http://localhost:3001`.

---
**Autora:** Bat-seba Rodríguez Moreno - `https://github.com/Bat-seba`.