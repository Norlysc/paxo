// Prepara las fotos de obras para la galeria de la landing.
//
//   node scripts/preparar-fotos-obras.mjs [carpeta-origen]
//
// Origen por defecto: Escritorio\Fotos-Obras-PAXO. Toma todas las fotos (en la
// raiz o en subcarpetas) y, si existe, aplica clasificacion.json de esa misma
// carpeta:
//   { "categorias": { "foto.jpg": "acabados" }, "omitir": [...], "primero": [...] }
// Sin clasificacion, la categoria sale del nombre de la subcarpeta
// ("Instalaciones", "Acabados"...).
//
// Son fotos de telefono de distintos tamanos y orientaciones. De cada una se
// generan dos WebP en public/obras/:
//   <id>.webp       tarjeta 4:5 (960x1200), recorte inteligente hacia la zona
//                   con mas detalle: todas las tarjetas quedan del mismo tamano
//   <id>-full.webp  foto completa sin recortar (max 1600 px) para la vista ampliada
// con enderezado por EXIF y un ajuste suave de luz, color y nitidez. Al final
// reescribe lib/obras.generated.ts.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// sharp llega como dependencia de next; se resuelve desde ahi.
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] }));

const WEB = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const ORIGEN = path.resolve(process.argv[2] ?? path.join(os.homedir(), "Desktop", "Fotos-Obras-PAXO"));
const DESTINO = path.join(WEB, "public", "obras");
const SALIDA = path.join(WEB, "lib", "obras.generated.ts");
const EXT = /\.(jpe?g|png|webp|heic|heif)$/i;
const CATEGORIAS = ["construccion", "instalaciones", "acabados", "seguridad"];

const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function categoriaDeCarpeta(nombre) {
  const t = sinAcentos(nombre);
  if (t.includes("construc")) return "construccion";
  if (t.includes("instala")) return "instalaciones";
  if (t.includes("acabad")) return "acabados";
  if (t.includes("segur")) return "seguridad";
  return undefined;
}

function leerClasificacion() {
  const f = path.join(ORIGEN, "clasificacion.json");
  if (!fs.existsSync(f)) return { categorias: {}, omitir: [], primero: [] };
  const c = JSON.parse(fs.readFileSync(f, "utf8"));
  return { categorias: c.categorias ?? {}, omitir: c.omitir ?? [], primero: c.primero ?? [] };
}

/** Lista recursiva de fotos con la categoria de su subcarpeta. */
function listarFotos(carpeta, categoriaCarpeta) {
  const fotos = [];
  for (const e of fs.readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = path.join(carpeta, e.name);
    if (e.isDirectory()) {
      if (sinAcentos(e.name).replace(/^\d+\s*-\s*/, "").startsWith("ejemplo")) continue;
      fotos.push(...listarFotos(ruta, categoriaDeCarpeta(e.name) ?? categoriaCarpeta));
    } else if (EXT.test(e.name)) {
      fotos.push({ ruta, archivo: e.name, categoria: categoriaCarpeta });
    }
  }
  return fotos;
}

const ajustar = (img) =>
  img
    .modulate({ brightness: 1.04, saturation: 1.08 })
    .linear(1.06, -6) // un poco mas de contraste
    .sharpen({ sigma: 0.7 });

const omitidas = [];

async function preparar(ruta, id) {
  try {
    const enderezada = await sharp(ruta, { failOn: "none" }).rotate().toBuffer(); // endereza segun EXIF
    await ajustar(sharp(enderezada).resize(960, 1200, { fit: "cover", position: sharp.strategy.attention }))
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(DESTINO, `${id}.webp`));
    await ajustar(sharp(enderezada).resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }))
      .webp({ quality: 80, effort: 5 })
      .toFile(path.join(DESTINO, `${id}-full.webp`));
    return true;
  } catch (err) {
    omitidas.push(`${path.relative(ORIGEN, ruta)} (${err.message.split("\n")[0]})`);
    return false;
  }
}

if (!fs.existsSync(ORIGEN)) {
  console.error(`No existe la carpeta de origen: ${ORIGEN}`);
  process.exit(1);
}
fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });

const clasif = leerClasificacion();
const fotos = listarFotos(ORIGEN)
  .filter((f) => !clasif.omitir.includes(f.archivo))
  .map((f) => {
    const c = clasif.categorias[f.archivo];
    return { ...f, categoria: CATEGORIAS.includes(c) ? c : f.categoria };
  })
  .sort((a, b) => a.archivo.localeCompare(b.archivo, "es", { numeric: true }));

// Orden: primero las elegidas; el resto se intercala por categoria para que
// no queden seguidas muchas fotos del mismo tipo de trabajo.
const primero = clasif.primero.map((n) => fotos.find((f) => f.archivo === n)).filter(Boolean);
const resto = fotos.filter((f) => !primero.includes(f));
const grupos = new Map();
for (const f of resto) {
  const k = f.categoria ?? "otras";
  if (!grupos.has(k)) grupos.set(k, []);
  grupos.get(k).push(f);
}
const intercaladas = [];
while ([...grupos.values()].some((g) => g.length)) {
  for (const g of grupos.values()) if (g.length) intercaladas.push(g.shift());
}

const obras = [];
for (const [i, f] of [...primero, ...intercaladas].entries()) {
  const id = `obra-${String(i + 1).padStart(2, "0")}`;
  if (await preparar(f.ruta, id)) {
    obras.push({ id, categoria: f.categoria, foto: `/obras/${id}.webp`, fotoGrande: `/obras/${id}-full.webp` });
  }
}

const limpio = obras.map((o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)));
fs.writeFileSync(
  SALIDA,
  `// Generado por scripts/preparar-fotos-obras.mjs — no editar a mano: vuelve a\n` +
    `// ejecutar el script despues de cambiar las fotos en la carpeta de origen.\n` +
    `import type { Obra } from "./gallery";\n\n` +
    `export const OBRAS_GENERADAS: Obra[] = ${JSON.stringify(limpio, null, 2)};\n`
);

const peso = fs.readdirSync(DESTINO).reduce((t, f) => t + fs.statSync(path.join(DESTINO, f)).size, 0);
if (omitidas.length) console.warn(`No se pudieron leer ${omitidas.length} fotos:\n  ${omitidas.join("\n  ")}`);
console.log(
  `${obras.length} fotos publicadas (${clasif.omitir.length} omitidas a proposito), ${(peso / 1024 / 1024).toFixed(1)} MB en total.`
);
