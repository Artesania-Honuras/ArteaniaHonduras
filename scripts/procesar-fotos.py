"""
Procesa las fotografías reales de producto y las conecta al catálogo.

Facebook, Instagram y la mayoría de las redes no permiten descargar las fotos de
una página sin iniciar sesión, así que este script está pensado para que tú bajes
las fotos a mano (o las exportes de tu teléfono) y el resto lo haga un comando:

    1. Guardas las fotos en la carpeta `fotos-originales/`.
    2. Ejecutas:  npm run fotos:procesar
    3. El script optimiza cada imagen, la publica y actualiza el JSON del producto.

Nombres de archivo aceptados (la coincidencia ignora tildes, mayúsculas y espacios):

    vasija-barro-lenca-marcala.jpg          -> imagen principal de ese producto
    Vasija de barro lenca.jpg               -> lo mismo, por nombre comercial
    vasija-barro-lenca-marcala-2.jpg        -> segunda foto (galería)
    vasija barro lenca 3.png                -> tercera foto (galería)

Reglas:
  - La primera coincidencia alfabética es la imagen principal; el resto van a la
    galería en orden alfabético.
  - Las imágenes se redimensionan a 1400 px de lado mayor, se les quita el EXIF
    (incluidas las coordenadas GPS) y se convierten a WebP.
  - Los originales NO se borran nunca: la carpeta `fotos-originales/` está
    ignorada por git y no se publica.
  - Lo que no logre asignarse se reporta al final y se deja intacto.

Uso:
    python scripts/procesar-fotos.py
    python scripts/procesar-fotos.py --lado 2000 --calidad 88
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    print("Falta Pillow. Instálalo con: pip install Pillow", file=sys.stderr)
    raise SystemExit(1)

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "fotos-originales"
DESTINO = RAIZ / "public" / "imagenes" / "fotos"
DIR_PRODUCTOS = RAIZ / "src" / "data" / "productos"

# En Windows la consola usa cp1252 por defecto y no puede representar símbolos
# como ✓ o →, lo que hacía fallar el script a mitad del proceso. Se fuerza UTF-8
# con reemplazo para que la salida nunca sea motivo de error.
for _flujo in (sys.stdout, sys.stderr):
    try:
        _flujo.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):  # pragma: no cover
        pass

EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}
# Ruta que se escribe en el JSON. Es relativa a la raíz del dominio y sin el
# subdirectorio de GitHub Pages: `src/lib/catalogo.ts` le añade el base.
PREFIJO_PUBLICO = "/imagenes/fotos"


def normalizar(texto: str) -> str:
    """Minúsculas, sin tildes, solo letras/números separados por guiones."""
    sin_acentos = unicodedata.normalize("NFKD", texto)
    sin_acentos = "".join(c for c in sin_acentos if not unicodedata.combining(c))
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", sin_acentos.lower())).strip("-")


def cargar_productos() -> dict[str, dict]:
    """Devuelve {slug: (ruta_json, datos)} de todo el catálogo."""
    catalogo: dict[str, dict] = {}
    for archivo in sorted(DIR_PRODUCTOS.glob("*.json")):
        datos = json.loads(archivo.read_text(encoding="utf-8"))
        catalogo[datos["slug"]] = {"archivo": archivo, "datos": datos}
    return catalogo


def construir_indice(catalogo: dict[str, dict]) -> dict[str, str]:
    """
    Índice de búsqueda: clave normalizada -> slug del producto.
    Se indexa tanto el slug como el nombre comercial.
    """
    indice: dict[str, str] = {}
    for slug, entrada in catalogo.items():
        indice.setdefault(normalizar(slug), slug)
        indice.setdefault(normalizar(entrada["datos"]["nombre"]), slug)
    return indice


def identificar(archivo: Path, indice: dict[str, str]) -> tuple[str, bool] | None:
    """
    Devuelve (slug, es_principal) o None si el archivo no corresponde a ninguna
    pieza. Se busca la clave más larga que coincida para evitar que un nombre
    corto capture a otro producto.
    """
    tallo = normalizar(archivo.stem)
    candidatos = sorted(indice.items(), key=lambda par: len(par[0]), reverse=True)

    for clave, slug in candidatos:
        if tallo == clave:
            return slug, True
        if tallo.startswith(f"{clave}-"):
            return slug, False
    return None


def optimizar(origen: Path, destino: Path, lado: int, calidad: int) -> tuple[int, int]:
    """Redimensiona, corrige orientación, quita metadatos y guarda en WebP."""
    with Image.open(origen) as imagen:
        imagen = ImageOps.exif_transpose(imagen)

        if imagen.mode in ("RGBA", "LA", "P"):
            fondo = Image.new("RGB", imagen.size, (250, 244, 236))
            convertida = imagen.convert("RGBA")
            fondo.paste(convertida, mask=convertida.split()[-1])
            imagen = fondo
        else:
            imagen = imagen.convert("RGB")

        imagen.thumbnail((lado, lado), Image.Resampling.LANCZOS)

        destino.parent.mkdir(parents=True, exist_ok=True)
        # Sin `exif` en los parámetros: los metadatos (incluido el GPS) no viajan.
        imagen.save(destino, "WEBP", quality=calidad, method=6)

        return imagen.size


def main() -> int:
    analizador = argparse.ArgumentParser(description="Procesa las fotos reales del catálogo.")
    analizador.add_argument("--lado", type=int, default=1400, help="Lado mayor en píxeles (1400)")
    analizador.add_argument("--calidad", type=int, default=82, help="Calidad WebP (82)")
    opciones = analizador.parse_args()

    if not ORIGEN.exists():
        print(f"No existe la carpeta {ORIGEN.name}/.", file=sys.stderr)
        print("Créala y coloca ahí las fotos, con el nombre del producto en el archivo.", file=sys.stderr)
        return 1

    archivos = sorted(
        (a for a in ORIGEN.iterdir() if a.is_file() and a.suffix.lower() in EXTENSIONES),
        key=lambda a: a.name.lower(),
    )

    if not archivos:
        print(f"No hay imágenes en {ORIGEN.name}/.")
        print(f"Formatos aceptados: {', '.join(sorted(EXTENSIONES))}")
        return 1

    catalogo = cargar_productos()
    indice = construir_indice(catalogo)

    asignadas: dict[str, list[tuple[Path, bool]]] = {}
    sin_asignar: list[Path] = []
    errores: list[tuple[Path, str]] = []

    for archivo in archivos:
        coincidencia = identificar(archivo, indice)
        if coincidencia is None:
            sin_asignar.append(archivo)
            continue
        slug, es_principal = coincidencia
        asignadas.setdefault(slug, []).append((archivo, es_principal))

    # Orden de las fotos de cada pieza: primero la que coincide exactamente con el
    # nombre del producto (esa es la principal) y después las numeradas en orden.
    # Así `producto-3.jpg` nunca desplaza a `producto.jpg` solo por alfabeto.
    def numero_final(ruta: Path) -> int:
        coincidencia = re.search(r"-(\d+)$", normalizar(ruta.stem))
        return int(coincidencia.group(1)) if coincidencia else 0

    for slug in asignadas:
        asignadas[slug].sort(key=lambda par: (not par[1], numero_final(par[0]), par[0].name.lower()))

    print(f"Productos en el catálogo: {len(catalogo)}")
    print(f"Fotos encontradas:        {len(archivos)}")
    print(f"Productos con foto:       {len(asignadas)}")
    print()

    for slug in sorted(asignadas):
        entrada = catalogo[slug]
        fotos = [archivo for archivo, _ in asignadas[slug]]
        rutas_publicas: list[str] = []

        for indice_foto, origen in enumerate(fotos, start=1):
            sufijo = "" if indice_foto == 1 else f"-{indice_foto}"
            destino = DESTINO / f"{slug}{sufijo}.webp"
            try:
                ancho, alto = optimizar(origen, destino, opciones.lado, opciones.calidad)
            except Exception as causa:  # noqa: BLE001 - se reporta y se continúa
                errores.append((origen, str(causa)))
                continue

            rutas_publicas.append(f"{PREFIJO_PUBLICO}/{destino.name}")
            peso = destino.stat().st_size / 1024
            print(f"  {origen.name}  ->  {destino.name}  ({ancho}x{alto}, {peso:.0f} KB)")

        if not rutas_publicas:
            continue

        datos = entrada["datos"]
        datos["imagen"] = rutas_publicas[0]
        if len(rutas_publicas) > 1:
            datos["galeria"] = rutas_publicas[1:]
        else:
            datos.pop("galeria", None)

        entrada["archivo"].write_text(
            json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"  [ok] {entrada['archivo'].name} actualizado\n")

    # Avisos
    huerfanos = sorted(p.name for p in DESTINO.glob("*.webp") if p.stem not in {
        f"{slug}{'' if i == 1 else f'-{i}'}"
        for slug, fotos in asignadas.items()
        for i in range(1, len(fotos) + 1)
    }) if DESTINO.exists() else []

    if sin_asignar:
        print("Fotos que no coinciden con ninguna pieza (no se tocaron):")
        for archivo in sin_asignar:
            print(f"  · {archivo.name}")
        print("  Renómbralas con el slug o el nombre comercial del producto.\n")

    if errores:
        print("Fotos con error al procesar:")
        for archivo, causa in errores:
            print(f"  · {archivo.name}: {causa}")
        print()

    if huerfanos:
        print("Archivos publicados que ya no tienen origen (revísalos a mano):")
        for nombre in huerfanos:
            print(f"  · {nombre}")
        print()

    print("Listo. Revisa los cambios con `git status` y compila con `npm run build`.")
    print("Los originales siguen intactos en fotos-originales/.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
