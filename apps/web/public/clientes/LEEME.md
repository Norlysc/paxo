# Logos de empresas clientes

Los archivos de esta carpeta se muestran en la sección **"Empresas que confían
en PAXO"** de la landing (carrusel en `apps/web/components/Gallery.tsx`).

## Cómo agregar un logo

1. Guarda el archivo en esta carpeta, por ejemplo `nueva-empresa.png`.
2. Abre `apps/web/components/Gallery.tsx` y agrega una entrada al arreglo
   `CLIENTES`, eligiendo `alto` según la proporción del archivo:

   ```ts
   { nombre: "Nueva Empresa", logo: "/clientes/nueva-empresa.png", alto: "max-h-11" },
   ```

3. Ajusta la duración de la marquesina en `apps/web/app/globals.css`. La pista
   mide lo que mida el conjunto de logos, así que para conservar la misma
   velocidad hay que reajustarla: unos **5,7 segundos por logo** (seis logos →
   34s).

Toda entrada necesita su archivo de logo: el carrusel ya no tiene variante
tipográfica de reemplazo.

### Por qué `alto` cambia según el logo

A igual altura, un logo apaisado ocupa el triple de ancho que uno cuadrado y
hace que el cuadrado parezca diminuto a su lado. Por eso la altura no es
uniforme; se elige según el ancho dividido entre el alto del archivo:

| Proporción (ancho ÷ alto) | Clase `alto` | Ejemplo |
| --- | --- | --- |
| Hasta 1.5 (cuadrado o vertical) | `max-h-16` | Estar Seguros, Proseguros |
| Entre 1.5 y 3 | `max-h-11` | Seguros Altamira |
| Más de 3 (muy apaisado) | `max-h-10` | Quálitas, Seguros Caracas |

## Formato recomendado

- **PNG o SVG con fondo transparente.** Un JPG con fondo blanco también
  funciona, pero se nota el recuadro sobre la tarjeta.
- **Alto mínimo 120 px** (el carrusel los muestra a 48 px de alto; el doble o
  más evita que se vean borrosos en pantallas de alta densidad).
- Logo horizontal cuando exista esa versión: las tarjetas son más anchas que
  altas (176 × 80 px).

## Sobre el uso de estos logos

Son marcas registradas de cada empresa. El archivo oficial se solicita a cada
cliente o se toma de su manual de marca; mostrarlos como referencia comercial
requiere su autorización.
