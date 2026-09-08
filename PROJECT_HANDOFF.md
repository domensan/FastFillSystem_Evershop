# Fast Fill Systems — EverShop: documento de continuidad

Documento histórico del MVP: 29 de julio de 2026.

**Entorno vigente (8 de septiembre de 2026):** consultar [MAC_SETUP.md](MAC_SETUP.md).
V2 ya es un repositorio Git y soporta EN/ES; las rutas de Windows y los pasos
de creación inicial de Git que siguen son referencias históricas. El build actual
copia rutas y SCSS automáticamente.

Este archivo resume el estado del MVP local para poder retomar el trabajo sin depender del historial del chat.

## 1. Objetivo del proyecto

Migrar el sitio de Fast Fill Systems (FFS) a EverShop, manteniendo la identidad visual y la estructura del sitio original.

FFS no vende directamente por internet. El flujo estándar de compra de EverShop fue adaptado a una solicitud de cotización:

- Los productos se agregan a **My Quote**.
- El minicart lateral funciona como resumen de cotización.
- No hay pago, envío ni cupón.
- El formulario final envía una solicitud de cotización.
- Las solicitudes quedan disponibles en el administrador.

## 2. Entorno local

- Proyecto: `C:\Users\Domensan\Desktop\E_Comerce\evershopFFS`
- EverShop: `2.1.2`
- Node/npm: instalados localmente
- Base de datos: PostgreSQL
- URL pública local: `http://localhost:3000`
- Administrador: `http://localhost:3000/admin`
- Idioma: inglés
- Moneda configurada: USD

### Acceso al administrador

- Usuario: definir mediante la configuración del entorno local.
- Contraseña: no se almacena en el repositorio.

### Base de datos local

- Base de datos: definir mediante variables de entorno.
- Usuario: definir mediante variables de entorno.
- Contraseña: no se almacena en el repositorio.

Estos accesos son únicamente para el entorno local y deben reemplazarse antes de publicar.

## 3. Comandos principales

Ejecutar desde:

```powershell
cd C:\Users\Domensan\Desktop\E_Comerce\evershopFFS
```

Desarrollo:

```powershell
npm run dev
```

Compilar y ejecutar como producción local:

```powershell
npm run build
npm start
```

Inicio oculto usado durante el desarrollo:

```powershell
Start-Process -FilePath 'npm.cmd' -ArgumentList 'start' `
  -WorkingDirectory 'C:\Users\Domensan\Desktop\E_Comerce\evershopFFS' `
  -WindowStyle Hidden
```

Para reiniciar, primero identificar exclusivamente el PID del puerto 3000:

```powershell
netstat -ano | Select-String '0.0.0.0:3000'
taskkill /PID <PID_ENCONTRADO> /T /F
```

## 4. Configuración principal

Archivo: `config/default.json`

- Tema activo: `ffs`
- Extensión `ffs_quote`: prioridad 10
- Extensión `ffs_blog`: prioridad 11

El proyecto todavía no es un repositorio Git. Antes de seguir con cambios importantes conviene ejecutar `git init` y crear el primer commit.

## 5. Sitio público implementado

### Navegación

Navbar en inglés, con estas secciones:

- Products
- Services
- About Us
- Updates
- Distributor
- Download Catalog

Se eliminó **Request a Quote** del navbar. **Download Catalog** utiliza el diseño del botón principal.

En móvil existe un menú colapsable armonioso. El footer fue replicado con identidad FFS y sin referencias visibles a EverShop.

### Homepage

Se replicó la metodología visual del sitio original:

- Hero oscuro.
- Titular principal.
- Botones View Products y Request a Quote.
- Slideshow automático con cuatro imágenes originales.
- Duración aproximada: cinco segundos por imagen.
- Transición lateral.
- Respeto por `prefers-reduced-motion`.
- Secciones de productos, operaciones, ventajas, testimonios, estadísticas y contacto.
- Sello de 30 años animado.

Posición actual del sello:

- Escritorio: `top: 10rem`.
- Móvil: abajo a la derecha (`bottom: 1.25rem`).

Importante: EverShop sirve el SCSS del tema desde `themes/ffs/dist/pages/all/ffs.scss`. Cuando se modifica `themes/ffs/src/pages/all/ffs.scss`, ambas copias deben mantenerse sincronizadas antes de compilar.

### Products y categorías

La página `/products` usa un diseño oscuro semejante al original:

- Buscador.
- Sidebar de Product Categories.
- Cinco categorías principales con imagen.
- Fondo y diagramación propios de FFS.

Categorías principales:

1. Couplers
2. Fuel Nozzles
3. Fuel Receivers
4. Fuel Vents
5. Pressureless

El sidebar compartido también está implementado en todas las páginas de categoría y subcategoría. Cada grupo utiliza `<details>` y el grupo actual aparece abierto inicialmente.

Las subcategorías se obtienen desde las categorías de los productos, igual que en `/products`. Existe un fallback hacia la categoría principal cuando una subcategoría visual no tiene una categoría independiente en la base de datos. Ejemplo: Standard Crankcase.

Estado importado:

- 84 productos.
- 21 categorías.
- Imágenes locales en `public/ffs/products`.

Observación: el nombre `Parts` se reutiliza visualmente bajo varios grupos, pero la base de datos actual puede resolverlo como una sola categoría.

### Páginas institucionales

Implementadas en inglés:

- `/services`
- `/about`
- `/distributor`

La página Distributor incluye un formulario funcional. Las solicitudes se guardan en el sistema de cotizaciones con SKU interno `DISTRIBUTOR`.

### Updates / Blog

Se creó una extensión de blog escalable en lugar de páginas estáticas:

- Listado: `/updates`
- Artículos dinámicos.
- Dos artículos iniciales tomados como referencia del sitio original.
- Imágenes locales.
- SEO.
- Paginación preparada.
- CRUD protegido en el administrador.

Extensión: `extensions/ffs_blog`

Archivos importantes:

- `src/migration/Version-1.0.0.ts`
- `src/graphql/types/BlogPost`
- `src/pages/frontStore/blogList/Updates.tsx`
- `src/pages/frontStore/blogPost/Article.tsx`
- `src/pages/admin/blogAdmin/BlogAdmin.tsx`

## 6. Sistema de cotización

Extensión: `extensions/ffs_quote`

Características:

- Add to Quote desde listados y fichas.
- Al agregar un producto se abre/actualiza el minicart lateral; no se redirige automáticamente.
- My Quote reutiliza el lenguaje visual del checkout.
- Se eliminaron pago, envío y cupones.
- Botón final: Send Quotation.
- API para crear, listar y actualizar solicitudes.
- Tabla de solicitudes creada por migración.
- Sección Quotes en el administrador.

Archivos importantes:

- `src/api/createQuote`
- `src/api/listQuotes`
- `src/api/updateQuote`
- `src/migration/Version-1.0.0.ts`
- `src/pages/frontStore/quoteRequest/QuoteRequest.tsx`
- `src/pages/admin/quoteGrid/QuoteGrid.tsx`

## 7. Administrador personalizado

Se aplicó identidad FFS al administrador:

- Login: logo completo de Fast Fill Systems.
- Interior del panel: solamente el escudo con la “F”.
- El escudo enlaza al dashboard.
- Verde principal de EverShop reemplazado por azul FFS.

Color corporativo principal:

```text
#5685AD
```

Modo oscuro:

```text
#6F9EC4
```

Las variables sobrescritas son:

- `--primary`
- `--ring`

Esto cubre botones, foco, bordes e indicadores activos. El verde semántico de mensajes de éxito se conserva intencionalmente.

Archivos:

- `extensions/ffs_quote/src/pages/admin/all/FfsAdminBrand.tsx`
- `extensions/ffs_quote/src/pages/admin/adminLogin/FfsLoginBrand.tsx`

## 8. Tema y archivos principales

Tema: `themes/ffs`

Puntos de entrada relevantes:

- `src/pages/all/ffs.scss`: estilos globales.
- `src/pages/all/FfsNav.tsx`: navbar y menú móvil.
- `src/pages/all/Logo.tsx`: logo público.
- `src/pages/homepage/Hero.tsx`: hero y slideshow.
- `src/pages/homepage/FeaturedProducts.tsx`: secciones de inicio.
- `src/pages/categoryView/CategoryView.tsx`: plantilla compartida de categorías.
- `src/components/frontStore/catalog/ProductListItemRender.tsx`: tarjetas de producto.
- `src/components/frontStore/catalog/ProductSingleForm.tsx`: acción de cotización en ficha.
- `src/components/frontStore/cart`: minicart y estados vacíos.
- `src/pages/cart/ShoppingCart.tsx`: My Quote.

Recursos visuales:

- `public/ffs/logo.png`
- `public/ffs/home`
- `public/ffs/products`
- `public/ffs/updates`
- `public/ffs/Gotham-Book.otf`

## 9. Proceso seguro para modificar

1. Editar siempre los archivos de `src`.
2. Compilar la extensión modificada:

```powershell
npx tsc -p extensions\ffs_quote\tsconfig.json
npx tsc -p extensions\ffs_blog\tsconfig.json
npx tsc -p themes\ffs\tsconfig.json
```

Ejecutar solo los comandos correspondientes a lo modificado.

Para una compilación completa, `npm run build` ejecuta estos pasos y copia automáticamente los archivos `route.json` y el SCSS del tema a `dist`.

3. Si se modifica `themes/ffs/src/pages/all/ffs.scss`, sincronizar:

```powershell
Copy-Item -Force `
  themes\ffs\src\pages\all\ffs.scss `
  themes\ffs\dist\pages\all\ffs.scss
```

4. Generar el proyecto:

```powershell
npm run build
```

5. Reiniciar el proceso del puerto 3000.
6. Validar las rutas afectadas y hacer una recarga forzada con `Ctrl + F5`.

## 10. Decisiones que deben conservarse

- No convertir el flujo en ecommerce tradicional.
- No reintroducir pago, shipping ni cupones.
- No redirigir a My Quote al agregar un producto.
- Mantener el idioma público en inglés.
- Mantener la estructura visual propia de FFS.
- Mantener el sidebar de categorías compartido en todos los niveles.
- Mantener el sello arriba en escritorio y abajo en móvil.
- Mantener Updates como blog administrable, no como páginas estáticas.
- Mantener verde únicamente para estados semánticos de éxito; la interacción principal del admin es azul FFS.

## 11. Estado al cerrar este resumen

- Sitio local operativo en el puerto 3000.
- Homepage y páginas principales terminadas para el MVP visual.
- Catálogo y categorías operativos.
- Imágenes locales operativas.
- Cotizaciones operativas.
- Blog operable y administrable.
- Branding del administrador aplicado.
- Última validación: el admin entrega las variables corporativas `#5685AD` para color primario y foco.

## 12. Próximos pasos recomendados

1. Crear repositorio Git y guardar un commit base.
2. Realizar revisión visual responsive completa en desktop, tablet y móvil.
3. Revisar textos definitivos con FFS.
4. Revisar jerarquía real de categorías y eliminar ambigüedades como `Parts`.
5. Configurar correo real para las solicitudes de cotización.
6. Preparar variables y credenciales de producción.
7. Definir hosting, dominio, backups y despliegue.
