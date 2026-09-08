# FFS V2 en este Mac

Actualizado: 8 de septiembre de 2026.

## Versión y organización

GitHub manda: base `4a067ae` de `origin/main` (7 de septiembre de 2026).
Se compararon las tres copias trasladadas desde Windows: la raíz era antigua;
el código de `evershopFFS` y `evershopFFS-es` ya coincide con GitHub. No había
historial `.git` local ni código adicional que fusionar. La preparación de Mac
se integra mediante la rama `setup/mac-v2` en `main`.

```text
EverShop_FFS/
  FFS_V2/                  Repositorio principal / inglés (main)
    ES/                    Worktree español (local/es)
    node_modules/          Una instalación nativa para Mac
    .env                   Conexión privada a ffs_v2
    Bd/evershop_ffs.dump    Respaldo original privado
  .local/
    Postgres.app/          PostgreSQL 17.11 oficial
    pgdata/                Datos locales de PostgreSQL
    postgres.log
```

Las copias antiguas se conservaron como respaldo. Trabajar desde `FFS_V2`.
`ES` comparte las dependencias mediante un enlace simbólico, pero tiene código
y caché `.evershop` independientes: EverShop no permite compartir esa caché
entre dos idiomas ejecutándose simultáneamente.

## Arranque diario

Desde `FFS_V2`, iniciar PostgreSQL si todavía no está ejecutándose:

```bash
../.local/Postgres.app/Contents/Versions/17/bin/pg_ctl \
  -D ../.local/pgdata -l ../.local/postgres.log \
  -o '-h 127.0.0.1 -p 5432 -k /tmp' start
```

En una terminal, inglés:

```bash
cd /Users/marketingffs/Desktop/Code/Evershop-FastFillSystems/EverShop_FFS/FFS_V2
npm run dev:en
```

En otra terminal, español:

```bash
cd /Users/marketingffs/Desktop/Code/Evershop-FastFillSystems/EverShop_FFS/FFS_V2/ES
npm run dev:es
```

- EN: http://localhost:3000 — Admin: http://localhost:3000/admin
- ES: http://localhost:3001 — Admin: http://localhost:3001/admin

Ambos usan la base `ffs_v2`, restaurada desde el respaldo del 7 de septiembre.
Cambios de catálogo, blog o cotizaciones afectan a ambos. Los textos del tema
usan `config/default.json`, `config/es.json` y `translations/en` / `translations/es`.
La contraseña del administrador sigue siendo la del respaldo; no se reinició.
Detener cada servidor con Ctrl+C. Para detener PostgreSQL:

```bash
../.local/Postgres.app/Contents/Versions/17/bin/pg_ctl -D ../.local/pgdata stop
```

## Editar y sincronizar EN/ES

Editar el código compartido en la raíz de `FFS_V2`. El modo desarrollo compila
y observa los archivos automáticamente. Para comprobar TypeScript:

```bash
npm run build:custom
```

Guardar cambios en `main`, detener ES y actualizar su worktree:

```bash
git add <archivos-modificados>
git commit -m "Descripción del cambio"
git -C ES merge --ff-only main
cd ES
npm run dev:es
```

Antes de actualizar ES, revisar `git -C ES status`: guardar cualquier cambio
hecho allí. No borrar ni sobrescribir trabajo pendiente.

Para incorporar novedades de GitHub, con ambos servidores detenidos:

```bash
git fetch origin
git merge origin/main
git -C ES merge --ff-only main
```

Si cambia `package-lock.json`, ejecutar `npm ci` solamente en la raíz.
**No ejecutar `npm ci` dentro de ES**, porque usa el mismo `node_modules`.
Para producción local: `npm run build && npm start` en EN, o
`NODE_CONFIG_ENV=es npm run build` y `NODE_CONFIG_ENV=es PORT=3001 npm start` en ES.

## Reconstruir en otro Mac

1. Instalar Node compatible con EverShop 2.1.2 (este Mac se verificó con Node 24.20.0).
2. Instalar PostgreSQL 17 desde https://postgresapp.com/downloads.html o Homebrew.
3. Clonar GitHub y ejecutar `npm ci`; nunca transportar `node_modules`, `dist` o `.evershop`.
4. Copiar solamente `.env`, `Bd/` y `media/` del respaldo privado. Configurar
   credenciales locales y restaurar en una **base nueva**, sin borrar datos existentes.
5. Crear ES y sus enlaces desde la raíz:

```bash
git worktree add ES -b local/es main
ln -s ../node_modules ES/node_modules
ln -s ../.env ES/.env
ln -s ../media ES/media
```

El arranque de PostgreSQL de la sección anterior corresponde exclusivamente a
la instalación portátil de este Mac. En otro equipo usar la ruta o servicio de
su instalación. Los datos privados, dependencias y compilaciones están ignorados
por Git. Revisar siempre `git status` antes de confirmar cambios.
