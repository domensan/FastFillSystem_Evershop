# Continuar EverShop FFS en un Mac

Esta guía permite reconstruir el entorno de desarrollo de Fast Fill Systems en macOS y continuar trabajando con GitHub.

## Qué contiene cada respaldo

El repositorio GitHub contiene el código, el tema, las extensiones y las imágenes públicas:

```text
https://github.com/domensan/FastFillSystem_Evershop
```

La copia privada trasladada desde Windows debe contener además:

```text
.env
media/
Bd/evershop_ffs.dump
```

Estos tres elementos no deben subirse a GitHub: contienen configuración, archivos locales y datos de PostgreSQL.

## 1. Instalar las herramientas

Instalar Xcode Command Line Tools:

```bash
xcode-select --install
```

Si Homebrew no está instalado, instalarlo desde <https://brew.sh/>. Después instalar Git, Node.js y PostgreSQL 17:

```bash
brew install git node postgresql@17
brew services start postgresql@17
```

Comprobar la instalación:

```bash
git --version
node --version
npm --version
psql --version
```

Si macOS no encuentra los comandos de PostgreSQL, añadirlos al `PATH`:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

En un Mac Intel, Homebrew puede usar `/usr/local` en lugar de `/opt/homebrew`. En ese caso ejecutar:

```bash
echo 'export PATH="/usr/local/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 2. Obtener el proyecto

Clonar el repositorio:

```bash
git clone https://github.com/domensan/FastFillSystem_Evershop.git
cd FastFillSystem_Evershop
```

Copiar desde el respaldo privado al directorio recién clonado:

```text
.env
media/
Bd/evershop_ffs.dump
```

No reemplazar el código del repositorio con una copia antigua. Sólo agregar esos tres elementos privados.

## 3. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm ci
```

`node_modules` no se transporta desde Windows: contiene binarios específicos del sistema y se regenera en el Mac.

## 4. Restaurar PostgreSQL

Crear el usuario. Cuando se solicite la contraseña, ingresar el mismo valor configurado como `DB_PASSWORD` en `.env`:

```bash
createuser --login --pwprompt evershop_ffs
```

Crear la base:

```bash
createdb --owner=evershop_ffs evershop_ffs
```

Cargar temporalmente la contraseña desde `.env` y restaurar el respaldo:

```bash
export PGPASSWORD="$(sed -n 's/^DB_PASSWORD=//p' .env | tr -d '\"')"
pg_restore \
  --host=localhost \
  --port=5432 \
  --username=evershop_ffs \
  --dbname=evershop_ffs \
  --no-owner \
  --no-privileges \
  Bd/evershop_ffs.dump
unset PGPASSWORD
```

Si la base ya existe y se necesita repetir la restauración, eliminarla y crearla nuevamente antes de ejecutar `pg_restore`. Confirmar siempre que no contenga trabajo nuevo antes de borrarla.

## 5. Levantar EverShop

Modo desarrollo:

```bash
npm run dev
```

Abrir:

```text
Web:   http://localhost:3000
Admin: http://localhost:3000/admin
```

Para comprobar una compilación de producción:

```bash
npm run build
npm start
```

## 6. Flujo diario con Git

Antes de comenzar:

```bash
git switch main
git pull --ff-only
git status
```

Después de trabajar:

```bash
git status
git add .
git commit -m "Describe brevemente el cambio"
git push
```

Nunca confirmar ni subir:

```text
.env
Bd/
media/
node_modules/
.evershop/
dist/
```

Antes de cada commit conviene revisar `git status` y confirmar que ninguno de esos elementos aparezca entre los archivos preparados.

## 7. Archivos importantes del proyecto

```text
config/                    Configuración de EverShop
extensions/ffs_quote/      Solicitudes de cotización y personalización del admin
extensions/ffs_blog/       Blog público y administración de artículos
themes/ffs/                Tema de la web pública
public/ffs/                Logos e imágenes públicas
media/                     Archivos locales asociados a datos de EverShop
scripts/import-mvp.mjs     Importador inicial del catálogo
PROJECT_HANDOFF.md         Resumen funcional y decisiones del proyecto
```

## 8. Si algo falla

Comprobar primero:

```bash
git status
node --version
psql --version
brew services list
```

Verificar que `.env` exista en la raíz y que `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` correspondan a la base restaurada. No pegar el contenido completo de `.env` en chats, issues o commits.
