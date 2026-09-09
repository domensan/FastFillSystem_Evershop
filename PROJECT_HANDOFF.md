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

## 13. Galería de producto, visor 3D y descripción real (8 de septiembre de 2026)

Cambios aplicados a **todas** las fichas de producto (no solo Atlas), salvo que se indique lo contrario. Nada de esto requirió tocar la base de datos de EverShop más allá de lo señalado en "Contenido cargado para el Atlas Nozzle".

### 13.1 Nueva galería de imágenes

Se reemplazó por completo la galería de producto que traía EverShop por defecto (un carrusel `react-slick` con puntos como miniaturas).

Archivos nuevos, dentro del tema:

- `themes/ffs/src/components/frontStore/catalog/Media.tsx`
- `themes/ffs/src/components/frontStore/catalog/Media.scss`

Comportamiento:

- **Escritorio:** rail vertical de miniaturas a la izquierda de la imagen principal. La miniatura activa se marca con un borde azul FFS. Al hacer clic en la imagen principal se abre un lightbox de pantalla completa con flechas para navegar.
- **Móvil:** el rail de miniaturas se oculta; en su lugar aparecen puntos de paginación debajo de la imagen principal (deslizable con los puntos, no con swipe táctil todavía).
- Si un producto no tiene imágenes, se muestra el ícono genérico de "sin imagen" que ya traía EverShop.

### 13.2 Visor 3D interactivo

Se agregó soporte para mostrar un modelo 3D interactivo dentro de la misma galería, como una miniatura más ("3D") en escritorio y como un botón flotante "View 3D" / "View photos" en móvil.

**Origen de los modelos 3D:** el usuario mantiene un proyecto aparte en `Desktop/Code/3D Web` (fuera de este repositorio) con los archivos `.glb` y un visor de referencia hecho con [`<model-viewer>`](https://modelviewer.dev/) de Google. Cuando exista un modelo nuevo para otro producto, hay que:

1. Copiar el `.glb` correspondiente a `public/ffs/3d/` dentro de este proyecto.
2. Agregar una entrada en el mapa `MODEL_BY_SKU` (arriba de `Media.tsx`) con el SKU del producto, la ruta pública del `.glb` y, si están medidas, sus dimensiones (ver 13.3).

Hoy solo existe el modelo del Atlas Nozzle: `public/ffs/3d/n150atp.glb` (SKU `N150ATp`).

La librería `model-viewer` se carga bajo demanda (solo cuando el usuario abre la pestaña 3D de un producto que tiene modelo), vía CDN de Google, para no afectar el peso de las páginas que no la usan.

**Importante para quien edite este componente:** `<model-viewer>` es un web component, no un elemento HTML nativo. React **no** traduce `className` a `class` en elementos con guion en el nombre de la etiqueta, así que el tamaño del visor se fija con `style={{ width: '100%', height: '100%' }}` en vez de una clase CSS. Si en algún momento el modelo 3D vuelve a aparecer chico y pegado a una esquina, es casi seguro que alguien volvió a intentar controlar su tamaño con una clase en vez de `style`.

### 13.3 Overlay de medidas sobre el modelo 3D

Se portó al sitio la función de medidas que el usuario agregó después en el proyecto `3D Web` (commit "Add product dimensions with gray labels and responsive view"): un botón "Measurements" que dibuja, sobre el propio modelo, las cotas de largo/alto/diámetro con líneas guía punteadas y etiquetas en mm y pulgadas.

- Los valores nominales de cada medida se definen junto al modelo en `MODEL_BY_SKU` (campo `dimensions`), no están hardcodeados en el componente de dibujo.
- El overlay (SVG) y el propio `<model-viewer>` viven dentro de un mismo contenedor (`.ffs-gallery__model-render`) que se puede desplazar como un bloque (hoy tiene un `transform: translateX(7%)` para centrar mejor la pieza dentro del recuadro). **Si el modelo se vuelve a mover, hay que mover ese contenedor completo, nunca solo el `<model-viewer>` por separado** — las líneas de medida se calculan a partir de coordenadas internas del visor que no se enteran de transformaciones CSS aplicadas después.
- Los botones "Measurements" y "Reset view" están fuera de ese contenedor (no se mueven con el modelo), anclados siempre a la esquina inferior izquierda del recuadro.

### 13.4 Descripción real en la ficha de producto

`themes/ffs/src/components/frontStore/catalog/ProductSingleForm.tsx` ahora muestra, debajo del SKU, la descripción real que ya existía en la base de datos de cada producto (campo `description` de `product_description`) pero que nunca se llegaba a renderizar en ningún lado del sitio público. Se quitaron el encabezado genérico "Product Inquiry / Build your quote" y el acordeón fijo "Technical information" que antes ocupaban ese espacio.

Si un producto no tiene descripción cargada, el bloque simplemente no aparece (no se inventa texto de relleno).

Pendiente: por ahora no existen los campos "Key points" ni "Variations" que aparecían en el mockup de referencia del usuario; se decidió omitirlos hasta que haya contenido real para cargar (ver 13.6).

### 13.5 Alineación de las dos columnas de la ficha

En `themes/ffs/src/pages/all/ffs.scss`, la fila `.product__page__middle > .grid` (imagen + info del producto) tenía `align-items: center`, pensado para cuando la columna de texto era más corta que la imagen. Al agregar la descripción real, la columna de texto pasó a ser más alta que la imagen y ese `center` hacía que la imagen quedara flotando descentrada. Se cambió a `align-items: start` (y `align-self: start` en `.product__detail__right`) para que ambas columnas arranquen siempre a la misma altura.

### 13.6 Contenido cargado para el Atlas Nozzle (SKU `N150ATp`, product_id `6`)

Cambios hechos directamente en la base de datos `ffs_v2`, específicos de este producto:

- Se agregaron 2 imágenes de galería que existían en la página oficial pero no se habían importado (`public/ffs/products/n150atp-2.jpg` y `n150atp-3.jpg`, filas nuevas en `product_image`).
- Se actualizó `product_description.description` con el texto de descripción provisto por el usuario.
- Se acortó el nombre del producto de "Atlas Fuel Nozzle with Stainless Steel Castle and Plug" a **"Atlas Fuel Nozzle"** (campo `name`, y `meta_title`/`meta_description` a juego). La URL del producto no se tocó, para no romper el enlace existente.

**Nota de precisión pendiente de confirmar con ingeniería:** el texto de descripción cargado dice que el Atlas usa "twelve stainless-steel ball bearings" para el latching. Según `MD/02_products.md`, esa característica corresponde al Piston SureLoc/Titan, y las especificaciones del Atlas están marcadas ahí como "no confirmadas, no inferir". Se cargó el texto tal como lo pidió el usuario, pero conviene revisarlo con FFS antes de darlo por definitivo.

### 13.7 Archivos tocados en este bloque de trabajo

- `themes/ffs/src/components/frontStore/catalog/Media.tsx` (nuevo)
- `themes/ffs/src/components/frontStore/catalog/Media.scss` (nuevo)
- `themes/ffs/src/components/frontStore/catalog/ProductSingleForm.tsx`
- `themes/ffs/src/pages/all/ffs.scss`
- `scripts/copy-build-assets.mjs` (se generalizó para copiar cualquier `.scss` del tema a `dist`, no solo `pages/all/ffs.scss`; antes el SCSS de un componente nuevo como `Media.scss` no se copiaba y el build de producción quedaba sin esos estilos)
- `public/ffs/products/n150atp-2.jpg`, `n150atp-3.jpg` (nuevos)
- `public/ffs/3d/n150atp.glb` (nuevo)
- Base de datos `ffs_v2`: tabla `product_image` (2 filas nuevas) y `product_description` (producto 6) — ver 13.6.

## 14. Reordenamiento de catálogo, contenido SEO, formulario de cotización, página Legal y ajustes del hero (9 de septiembre de 2026)

### 14.1 Limpieza de productos duplicados

Se detectó y confirmó con el usuario que varios productos existían dos veces: una versión con SKU genérico tipo `001-x-x` (creada por una reconciliación automática anterior) y otra con el SKU real del fabricante. Se eliminaron de la base de datos `ffs_v2` (producto e imágenes huérfanas en `public/ffs/products`):

- `Titan N150Tp` (SKU `001-3-1`, product_id 84) — duplicado de lo que pasó a llamarse Atlas.
- `Classic N150Cp` (product_id 19).
- `SureLoc 1000` duplicado (product_id 88).
- `Sureloc N150PSL` duplicado (product_id 83) — se conservó el otro registro de este par a pedido explícito del usuario ("dejar una").

El script `scripts/sync-fuel-nozzles.mjs`, origen de estos duplicados, se dejó con un comentario grande marcándolo como obsoleto: no debe volver a ejecutarse tal como está. Su entrada para la familia `Titan` se actualizó a `Atlas` (SKU `N150ATp`) para que, si algún día se reutiliza como referencia, ya no reintroduzca el nombre viejo.

### 14.2 Renombre Titan → Atlas

La marca "Titan" se está descontinuando a favor de "Atlas" (confirmado también en el sitio oficial: la URL `titan-n150tp` en `fastfillsystems.com` ya muestra contenido de Atlas). Se renombró en la base de datos:

- Categoría 30: `Titan` → `Atlas` (incluyendo su `url_rewrite`). El producto 6 (Atlas Fuel Nozzle) quedó dentro de esta categoría.
- Categorías 24 y 35 renombradas a `SureLoc 150` y `SureLoc 1000` respectivamente (con sus `url_rewrite`). El producto 2 se movió a la categoría 35 y se renombró a "Piston Sureloc N1000PSLp" (`name`, `meta_title`, `meta_description`).

### 14.3 Jerarquía real de Fuel Receivers, Fuel Vents y Pressureless

Se repitió, para tres familias más, el mismo problema ya documentado para Fuel Nozzles: varias subcategorías existían como categorías **planas** de nivel superior en vez de ser hijas de su familia lógica, así que al entrar a la categoría padre solo se veían los pocos productos asignados directamente a ella.

Reorganización aplicada directamente en la base de datos:

- **Fuel Receivers** (categoría 16): se reparentaron `Check Valve` (18) y `Standard Receiver` (29) bajo ella; se crearon las subcategorías nuevas `Deep Socket Tool` (36) y `Parts` (37), y se les movieron los productos 20, 69, 72 y 78 (antes mezclados en el `Parts` genérico compartido, categoría 15).
- **Fuel Vents** (categoría 17): se reparentaron sus 9 subcategorías (ids 13, 14, 19, 20, 22, 23, 25, 28, 31) bajo ella; se creó `Parts` (38) y se le movió el producto 73.
- **Pressureless** (categoría 26): se reparentaron sus subcategorías (21, 27); se creó `Parts` (39) y se le movieron los productos 54, 52, 53, 70 y 75.

### 14.4 Orden de submenús y de las grillas de producto

A pedido del usuario, **Fuel Nozzles debe aparecer primero** en el submenú lateral de categorías en absolutamente todas las páginas (no solo en la propia página de Nozzles), tanto en EN como en ES. Dentro de cada familia, el orden también quedó fijo y debe respetarse si se agregan productos nuevos:

- **Fuel Nozzles:** Atlas / Pitboss / SureLoc 150 / SureLoc 1000 / Parts.
- **Fuel Receivers:** Check Valve / Standard Receiver / Deep Socket Tool / Parts.
- **Fuel Vents:** orden fijado para calzar con 3 páginas del catálogo impreso que aportó el usuario, con `Parts` al final.
- **Couplers:** los productos "Grease Receiver" y "Engine Oil Receiver" ya no aparecen primero en la grilla — el usuario prefirió que los nozzles de la familia se muestren antes que los receivers.

Esto se implementó en dos lugares que deben mantenerse sincronizados (mismo criterio de orden en ambos):

- `themes/ffs/src/pages/categoryView/CategoryView.tsx`: objeto `categoryGroups` (orden del submenú) más las constantes `nozzleFamilyRank`, `receiverPartsSkus`, `ventFamilyRank` y la función `couplerRank()`, usadas para ordenar `category.products.items` antes de renderizar la grilla.
- `extensions/ffs_quote/src/pages/frontStore/products/Products.tsx`: mismo criterio de orden replicado para la página `/products`.

**Nota técnica importante:** la familia Couplers tiene 27 productos, más que el límite anterior de la consulta GraphQL (`filters:[{key:"limit", value:"24"}]`). Como el ordenamiento se aplica en el cliente después de traer la página de resultados, con el límite en 24 la familia quedaba cortada a mitad de la lista y el orden se rompía. Se subió el límite a `"48"` en la consulta de `CategoryView.tsx`.

### 14.5 Corrección del bug del acordeón del sidebar

El usuario reportó que al hacer clic en "Parts" en el submenú se abrían "todas las parts de todos los submenús" — no era un problema de navegación (la página correcta sí cargaba), sino que **los cuatro acordeones de familia se abrían a la vez** en el sidebar. La causa: la lógica que decide si un acordeón está `open` comparaba el nombre de la categoría actual contra el **texto** de cada hijo (`children.some(c => c.toLowerCase() === currentName)`), y como Fuel Nozzles, Fuel Receivers, Fuel Vents y Pressureless tienen cada una su propia subcategoría llamada literalmente "Parts", el texto coincidía en las cuatro familias simultáneamente.

Solución en `CategoryView.tsx`: se agregó `categoryId` a la consulta GraphQL de `currentCategory`, y cada hijo del menú ahora se resuelve contra su categoría real (`resolvedChildren`, con su propio `categoryId`) para comparar por **id**, no por texto — tanto para decidir qué acordeón queda `open` como para el `aria-current` de cada enlace.

### 14.6 Descripciones de producto

Se agregó/actualizó texto descriptivo real en `product_description.description` para prácticamente todo el catálogo, en dos tandas:

1. Descripciones específicas pedidas por el usuario para Atlas, Pitboss, SureLoc 150 y SureLoc 1000 (texto entregado literal por el usuario).
2. Descripciones SEO para los **78 productos restantes** que no las tenían, con un límite de 46 palabras cada una, reutilizando el mismo texto entre variantes de color/línea cuando correspondía (por ejemplo, los nozzles Matrix de distintos colores). Todo el contenido se redactó apoyándose en `MD/02_products.md`, evitando afirmar a qué fluido corresponde cada código de color de los Matrix (el propio archivo MD advierte que eso no está verificado).

**Importante — esto no quedó en el repositorio de código:** ambas tandas se cargaron con `UPDATE` directos por SQL sobre la base `ffs_v2`, no mediante una migración de EverShop ni un archivo versionado en Git. Si se necesita reconstruir la base de datos desde cero, estas descripciones **no** se recrean solas al hacer `git clone` + migraciones; hay que volver a cargarlas (o, mejor, convertir este trabajo en una migración/seed real antes de que el proyecto pase a producción).

### 14.7 Formulario de cotización: país e industria

- **Bug de país:** el selector de país del formulario de cotización (`themes/ffs/src/pages/cart/ShoppingCart.tsx`) solo mostraba el placeholder "Country" porque la consulta GraphQL pedía `allowedCountries` (filtrado por `shipping_zone`, tabla vacía porque el sitio no tiene envíos reales). Se cambió a `countries` (lista completa, sin ese filtro), que sí devuelve los ~246 países.
- **Cambio de campos, a pedido del usuario, para mejorar la segmentación de marketing sin alargar el formulario:** se eliminó el campo `Address` y se reemplazó el campo de texto libre `Application or Comments` por un `select` obligatorio `Industry` con las opciones Mining, Construction, Agriculture, Rail, Fleet, Heavy Equipment y Other.

Cambios asociados en la extensión `ffs_quote`:

- `src/api/createQuote/[bodyParser]createQuote.ts`: recibe `industry`; el arreglo de campos obligatorios pasó de incluir `address1` a incluir `industry`; el correo de notificación ahora muestra un bloque `Location: {city}, {country}` (reemplaza al bloque de `Address`) y un bloque `Industry: {industry}` cuando corresponde.
- `src/api/listQuotes/listQuotes.ts`: el `SELECT` incluye la columna `industry`.
- `src/pages/admin/quoteGrid/QuoteGrid.tsx`: muestra `Location` (ciudad/país) e `Industry` en vez del bloque de dirección.
- `src/migration/Version-1.2.0.ts` (nueva): `ALTER TABLE ffs_quote_request ADD COLUMN IF NOT EXISTS industry varchar;` — aplicada también a mano contra la base de datos local en su momento porque el servidor de desarrollo no se reinició de inmediato; al desplegar en un entorno nuevo, esta migración sí corre sola.

### 14.8 Nueva dirección de FFS

La dirección de oficina cambió de Springville a **2055 S. Tracy Hall Parkway, Provo, UT 84606**. Se actualizó en todos los lugares donde aparecía: `FeaturedProducts.tsx` (sección de contacto del home), `Footer.tsx`, `extensions/ffs_quote/src/pages/frontStore/contact/Contact.tsx` y la página Legal nueva (ver 14.9).

### 14.9 Página Legal

Se replicó en `/legal` el contenido de `https://www.fastfillsystems.com/privacy-policy-2/` (Privacy Policy + Standard Condition of Sales), agregado al footer justo después de "Request a Quote".

- Archivos nuevos: `extensions/ffs_quote/src/pages/frontStore/legal/Legal.tsx` y su `route.json` (`path: "/legal"`).
- El texto se reprodujo fielmente, incluyendo inconsistencias propias de la fuente (numeración romana de secciones irregular, la frase "ten (5) years" que mezcla el número en palabras con el dígito) — no se "corrigieron" en silencio, quedan tal cual para que FFS decida.
- La dirección de oficina dentro del texto legal se actualizó a la nueva (14.8); los placeholders rotos `"[email protected]"` de la fuente se reemplazaron por `contact@fastfillsystems.com`.

### 14.10 Auditoría de enlaces del sitio

A partir de un bug puntual reportado por el usuario ("Become a Distributor" en el home llevaba al formulario de cotización en vez de al formulario de distribuidor), se revisaron los enlaces principales del sitio:

- `themes/ffs/src/pages/homepage/FeaturedProducts.tsx`: el botón "Become a Distributor" pasó de `href="/cart"` a `href="/distributor"`.
- `extensions/ffs_quote/src/pages/frontStore/services/Services.tsx`: los enlaces "Let's Talk" de cada servicio pasaron de `href="/cart"` a `href="/contact#contact-form"` (el CTA final de la página, "Get a Quote", se dejó apuntando a `/cart` a propósito, porque ese sí es un pedido de cotización).
- Se confirmó que el `id="contact-form"` duplicado entre el estado de éxito y el formulario de contacto en `Contact.tsx` no es un bug real: los dos `<div>` son mutuamente excluyentes según el estado del formulario (nunca coexisten en el DOM al mismo tiempo).

### 14.11 Hero del home: brillo y encuadre de la imagen del nozzle

El usuario reportó primero que la imagen del hero se veía demasiado oscura ("casi no se nota el nozzles") y, después de un primer ajuste de brillo, aclaró que el problema real era de **encuadre**: la foto original (`public/ffs/home/hero-1.webp`, 1920×1280) es mucho más alta de lo necesario para una franja de hero ancha y baja, así que al recortarla automáticamente con `object-fit: cover` el nozzle quedaba reducido a una porción muy pequeña del cuadro. El usuario adjuntó como referencia un recorte panorámico de la misma foto donde el nozzle se ve grande y bien centrado.

Cambios en `themes/ffs/src/pages/all/ffs.scss` (selector `.ffs-home-hero` y relacionados):

- Se aligeró el degradado oscuro (`::after`) y se le agregó `brightness(1.4) contrast(1.05)` al filtro de las imágenes del slideshow (que se mantienen en escala de grises).
- Se agregó `object-position: 68% center` para las imágenes del hero dentro del media query de móvil, porque en pantallas angostas y altas el recorte automático dejaba fuera justo la mitad donde está el nozzle.

Cambio de asset: `public/ffs/home/hero-1.webp` se reemplazó por una versión recortada a 1920×820 (con `sharp`, centrada sobre el nozzle) para que la composición se acerque a la referencia entregada por el usuario, en vez de depender únicamente de CSS para "adivinar" el encuadre correcto. Los otros tres slides (`hero-2/3/4.webp`) no se tocaron — el pedido fue solo sobre la imagen del nozzle.

### 14.12 Archivos tocados en este bloque de trabajo

- `themes/ffs/src/pages/categoryView/CategoryView.tsx`
- `extensions/ffs_quote/src/pages/frontStore/products/Products.tsx`
- `themes/ffs/src/pages/homepage/FeaturedProducts.tsx`
- `themes/ffs/src/pages/homepage/Hero.tsx` (sin cambios de código; solo se investigó como parte de 14.11, el fix quedó en `ffs.scss` y en el asset)
- `themes/ffs/src/pages/all/ffs.scss`
- `themes/ffs/src/components/frontStore/Footer.tsx`
- `themes/ffs/src/pages/cart/ShoppingCart.tsx`
- `extensions/ffs_quote/src/pages/frontStore/legal/Legal.tsx` (nuevo) + `route.json`
- `extensions/ffs_quote/src/pages/frontStore/services/Services.tsx`
- `extensions/ffs_quote/src/pages/frontStore/contact/Contact.tsx`
- `extensions/ffs_quote/src/api/createQuote/[bodyParser]createQuote.ts`
- `extensions/ffs_quote/src/api/listQuotes/listQuotes.ts`
- `extensions/ffs_quote/src/pages/admin/quoteGrid/QuoteGrid.tsx`
- `extensions/ffs_quote/src/migration/Version-1.2.0.ts` (nuevo)
- `scripts/sync-fuel-nozzles.mjs` (marcado obsoleto, ver 14.1)
- `translations/es/general.csv`
- `public/ffs/home/hero-1.webp` (reemplazado)
- Base de datos `ffs_v2`: eliminación de 4 productos duplicados (14.1), renombres y reparenteos de categorías (14.2 y 14.3), movimiento de productos entre categorías, `industry varchar` en `ffs_quote_request`, y las descripciones de producto de 14.6 (estas últimas **no versionadas en Git**, ver advertencia en 14.6).

Todo lo anterior se sincronizó también al worktree `ES` (rama `local/es`) mediante `git merge --ff-only main`, recompilando `tsc` y `copy-build-assets.mjs` en ambos lados después de cada cambio relevante.
