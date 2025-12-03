# Frontend - Rogen Autos

Aplicación React + Vite para visualización del catálogo de autos.

## Instalación

```bash
npm install
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

## Rutas

- `/` - Catálogo de autos (público)
- `/admin` - Panel de administración (requiere autenticación)

## Configuración

Si el backend está en un puerto diferente, configura la variable de entorno:

```env
VITE_API_URL=http://localhost:5000/api
```

