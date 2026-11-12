// Prepara las fotos de obras para la galeria de la landing.
//
//   node scripts/preparar-fotos-obras.mjs [carpeta-origen]
//
// Origen por defecto: Escritorio\Fotos-Obras-PAXO. Las fotos pueden ir sueltas
// o en subcarpetas; si el nombre de la subcarpeta contiene "construc",
// "instala", "acabad" o "segur", las fotos toman esa categoria. Un archivo
// datos.txt en la subcarpeta (Titulo:, Categoria:, Lugar:, Descripcion:) se
// aplica a sus fotos. Dentro de una subcarpeta, un par antes.* / despues.*
// se publica como una sola obra con comparador.
//
// Como son fotos de telefono, cada una se endereza segun su EXIF, se reduce a
// 1600 px, recibe un ajuste suave de luz, color y nitidez, y se guarda en WebP
// en public/obras/. Al final reescribe lib/obras.generated.ts.
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

const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slug = (s) => sinAcentos(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "obra";

function categoriaDe(texto) {
  const t = sinAcentos(texto ?? "");
  if (t.includes("construc") || t.includes("obra civil")) return "construccion";
  if (t.includes("instala") || t.includes("electric") || t.includes("plomer") || t.includes("aire")) return "instalaciones";
  if (t.includes("acabad") || t.includes("carpinter") || t.includes("pintur") || t.includes("herrer")) return "acabados";
  if (t.includes("segur") || t.includes("cctv") || t.includes("camara")) return "seguridad";
  return undefined;
}

function leerDatos(carpeta) {
  const f = path.join(carpeta, "datos.txt");
  if (!fs.existsSync(f)) return {};
  const datos = {};
  for (const linea of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*(titulo|título|categoria|categoría|lugar|descripcion|descripción)\s*:\s*(.+)$/i);
    if (m) datos[sinAcentos(m[1])] = m[2].trim();
  }
  return datos;
}

const omitidas = [];

/** Devuelve la ruta publica, o null si la foto no se pudo leer (p. ej. HEIC). */
async function preparar(origen, nombre) {
  const destino = path.join(DESTINO, `${nombre}.webp`);
  try {
    await sharp(origen, { failOn: "none" })
    .rotate() // endereza segun la orientacion EXIF del telefono
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .modulate({ brightness: 1.04, saturation: 1.08 })
    .linear(1.06, -6) // un poco mas de contraste
    .sharpen({ sigma: 0.7 })
    .webp({ quality: 80, effort: 5 })
    .toFile(destino);
  } catch (err) {
    omitidas.push(`${path.relative(ORIGEN, origen)} (${err.message.split("\n")[0]})`);
    return null;
  }
  return `/obras/${nombre}.webp`;
}

if (!fs.existsSync(ORIGEN)) {
  console.error(`No existe la carpeta de origen: ${ORIGEN}`);
  process.exit(1);
}
fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });

const obras = [];
const usados = new Set();
const nombreUnico = (base) => {
  let n = base, i = 2;
  while (usados.has(n)) n = `${base}-${i++}`;
  usados.add(n);
  return n;
};

async function procesarCarpeta(carpeta, heredado = {}) {
  const entradas = fs.readdirSync(carpeta, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));
  const esRaiz = carpeta === ORIGEN;
  const datos = { ...heredado, ...leerDatos(carpeta) };
  const nombreCarpeta = esRaiz ? "" : path.basename(carpeta).replace(/^\d+\s*-\s*/, "");
  // Las carpetas de ejemplo se ignoran.
  if (!esRaiz && sinAcentos(nombreCarpeta).startsWith("ejemplo")) return;
  const categoria = categoriaDe(datos.categoria) ?? categoriaDe(nombreCarpeta) ?? heredado.categoriaId;

  const fotos = entradas.filter((e) => e.isFile() && EXT.test(e.name)).map((e) => e.name);
  const antes = fotos.find((f) => /^antes\b/i.test(sinAcentos(f)));
  const despues = fotos.find((f) => /^despues\b/i.test(sinAcentos(f)));
  const base = slug(nombreCarpeta || "obra");

  if (antes && despues) {
    const nombre = nombreUnico(base);
    const foto = await preparar(path.join(carpeta, despues), nombre);
    const fotoAntes = await preparar(path.join(carpeta, antes), `${nombre}-antes`);
    if (foto) {
      // En un par antes/despues la carpeta es la obra: su nombre sirve de titulo,
      // salvo que sea solo el nombre de una categoria.
      const titulo = datos.titulo ?? (categoriaDe(nombreCarpeta) ? undefined : nombreCarpeta || undefined);
      obras.push({ id: nombre, titulo, categoria, ubicacion: datos.lugar, descripcion: datos.descripcion, foto, antes: fotoAntes ?? undefined });
    }
  }
  for (const f of fotos) {
    if (f === antes || f === despues) continue;
    const nombre = nombreUnico(base);
    const foto = await preparar(path.join(carpeta, f), nombre);
    // Solo la carpeta con datos.txt aporta titulo; las fotos sueltas no lo llevan.
    if (foto) obras.push({ id: nombre, titulo: datos.titulo, categoria, ubicacion: datos.lugar, foto });
  }
  for (const e of entradas) {
    if (e.isDirectory()) await procesarCarpeta(path.join(carpeta, e.name), { categoriaId: categoria, lugar: datos.lugar });
  }
}

await procesarCarpeta(ORIGEN);

// Las obras con antes/despues van primero: son las que mejor cuentan el trabajo.
obras.sort((a, b) => Number(Boolean(b.antes)) - Number(Boolean(a.antes)));

const limpio = obras.map((o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")));
fs.writeFileSync(
  SALIDA,
  `// Generado por scripts/preparar-fotos-obras.mjs — no editar a mano: vuelve a\n` +
    `// ejecutar el script despues de cambiar las fotos en la carpeta de origen.\n` +
    `import type { Obra } from "./gallery";\n\n` +
    `export const OBRAS_GENERADAS: Obra[] = ${JSON.stringify(limpio, null, 2)};\n`
);

const peso = fs.readdirSync(DESTINO).reduce((t, f) => t + fs.statSync(path.join(DESTINO, f)).size, 0);
if (omitidas.length) console.warn(`No se pudieron leer ${omitidas.length} fotos:\n  ${omitidas.join("\n  ")}`);
console.log(`${obras.length} obras (${obras.filter((o) => o.antes).length} con antes/despues), ${fs.readdirSync(DESTINO).length} archivos, ${(peso / 1024 / 1024).toFixed(1)} MB en total.`);
