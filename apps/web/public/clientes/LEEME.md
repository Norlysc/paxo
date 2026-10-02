# Logos de empresas clientes

Los archivos de esta carpeta se muestran en la sección **"Empresas que confían
en PAXO"** de la landing (carrusel en `apps/web/components/Gallery.tsx`).

## Cómo agregar un logo

1. Guarda el archivo en esta carpeta, por ejemplo `qap.png`.
2. Abre `apps/web/components/Gallery.tsx` y busca el arreglo `CLIENTES`.
3. En la empresa correspondiente, cambia `logo: null` por la ruta y ajusta
   `alto` según la proporción del archivo:

   ```ts
   { nombre: "QAP", destacado: "QAP", complemento: null,
     logo: "/clientes/qap.png", alto: "max-h-14" },
   ```

Mientras `logo` sea `null` se muestra el nombre compuesto en tipografía, que
mantiene la sección presentable.

### Por qué `alto` cambia según el logo

A igual altura, un logo apaisado ocupa el triple de ancho que uno cuadrado y
hace que el cuadrado parezca diminuto a su lado. Por eso la altura no es
uniforme; se elige según el ancho dividido entre el alto del archivo:

| Proporción (ancho ÷ alto) | Clase `alto` | Ejemplo |
| --- | --- | --- |
| Hasta 1.5 (cuadrado o vertical) | `max-h-16` | Estar Seguros, Proseguros |
| Entre 1.5 y 3 | `max-h-11` | Seguros Altamira |
| Más de 3 (muy apaisado) | `max-h-10` | Quálitas, Seguros Caracas |

Faltan por conseguir los archivos de **QAP** y **Corporación Kanata**.

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
