"""
Genera las dos imágenes raster de Artesanías De Honduras:

  - public/imagenes/og-default.png   (1200x630, tarjeta para redes sociales)
  - public/apple-touch-icon.png      (180x180, icono para iOS)

Son las únicas imágenes que no pueden ser SVG: las plataformas sociales y los
iconos de iOS no aceptan SVG. Se generan una sola vez y quedan versionadas en el
repositorio, por lo que el build del sitio NO depende de Python.

Uso:
    python scripts/generar-raster.py

Requiere Pillow (`pip install Pillow`). En Windows usa las tipografías del
sistema; si no las encuentra, cae a la tipografía por defecto de Pillow.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    print("Falta Pillow. Instálalo con: pip install Pillow", file=sys.stderr)
    raise SystemExit(1)

RAIZ = Path(__file__).resolve().parent.parent
SALIDA_IMAGENES = RAIZ / "public" / "imagenes"
SALIDA_PUBLICA = RAIZ / "public"

# Paleta de marca
CREMA_50 = (254, 251, 247)
CREMA_100 = (250, 244, 236)
CREMA_200 = (243, 231, 216)
BARRO_200 = (235, 191, 166)
BARRO_500 = (180, 82, 44)
BARRO_600 = (154, 67, 34)
BARRO_800 = (95, 41, 21)
OCRE_400 = (217, 169, 79)
OCRE_500 = (200, 147, 58)
OLIVO_500 = (110, 124, 75)
TINTA_900 = (42, 31, 24)
TINTA_500 = (122, 106, 94)

FUENTES_SERIF = [
    r"C:\Windows\Fonts\georgiab.ttf",
    r"C:\Windows\Fonts\georgia.ttf",
    r"C:\Windows\Fonts\timesbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
]

FUENTES_SANS = [
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def cargar_fuente(rutas: list[str], tamano: int):
    """Devuelve la primera tipografía disponible o la de Pillow por defecto."""
    for ruta in rutas:
        if os.path.exists(ruta):
            try:
                return ImageFont.truetype(ruta, tamano)
            except OSError:
                continue
    return ImageFont.load_default()


def degradado(tamano: tuple[int, int], inicio, fin) -> Image.Image:
    """Degradado diagonal: se pinta una retícula de 2x2 y se escala con suavizado."""
    base = Image.new("RGB", (2, 2))
    medio = tuple((inicio[i] + fin[i]) // 2 for i in range(3))
    base.putpixel((0, 0), inicio)
    base.putpixel((1, 0), medio)
    base.putpixel((0, 1), medio)
    base.putpixel((1, 1), fin)
    return base.resize(tamano, Image.Resampling.BICUBIC)


def rombo(dibujo: ImageDraw.ImageDraw, cx: float, cy: float, radio: float, relleno=None, contorno=None, grosor: int = 2):
    """Dibuja un rombo: el motivo lenca básico."""
    puntos = [
        (cx, cy - radio),
        (cx + radio, cy),
        (cx, cy + radio),
        (cx - radio, cy),
    ]
    if relleno is not None:
        dibujo.polygon(puntos, fill=relleno)
    if contorno is not None:
        dibujo.line(puntos + [puntos[0]], fill=contorno, width=grosor, joint="curve")


def patron_lenca(imagen: Image.Image, lado: int = 60, opacidad: float = 0.10) -> None:
    """Superpone una retícula de rombos lenca con baja opacidad."""
    capa = Image.new("RGBA", imagen.size, (0, 0, 0, 0))
    dibujo = ImageDraw.Draw(capa)
    color = (*BARRO_500, int(255 * opacidad))

    for fila, y in enumerate(range(0, imagen.size[1] + lado, lado)):
        desplazado = lado // 2 if fila % 2 else 0
        for x in range(0, imagen.size[0] + lado, lado):
            rombo(dibujo, x + desplazado, y, lado * 0.34, None, color, 2)

    if imagen.mode != "RGBA":
        base = imagen.convert("RGBA")
        base.alpha_composite(capa)
        imagen.paste(base.convert(imagen.mode))
    else:
        imagen.alpha_composite(capa)


def marca(dibujo: ImageDraw.ImageDraw, x: float, y: float, tamano: float) -> None:
    """Logotipo: rombo barro, rombo ocre y la letra A."""
    rombo(dibujo, x, y, tamano, BARRO_600)
    rombo(dibujo, x, y, tamano * 0.72, OCRE_400)

    grosor = max(2, int(tamano * 0.13))
    dibujo.line(
        [(x - tamano * 0.34, y + tamano * 0.42), (x, y - tamano * 0.44)],
        fill=BARRO_800,
        width=grosor,
    )
    dibujo.line(
        [(x, y - tamano * 0.44), (x + tamano * 0.34, y + tamano * 0.42)],
        fill=BARRO_800,
        width=grosor,
    )
    dibujo.line(
        [(x - tamano * 0.17, y + tamano * 0.12), (x + tamano * 0.17, y + tamano * 0.12)],
        fill=BARRO_800,
        width=grosor,
    )


def centrar(dibujo: ImageDraw.ImageDraw, texto: str, fuente, y: int, ancho: int, relleno) -> None:
    """Escribe texto centrado horizontalmente."""
    caja = dibujo.textbbox((0, 0), texto, font=fuente)
    dibujo.text(((ancho - (caja[2] - caja[0])) / 2 - caja[0], y), texto, font=fuente, fill=relleno)


def generar_og() -> Path:
    """Tarjeta social de 1200x630."""
    ancho, alto = 1200, 630
    imagen = degradado((ancho, alto), CREMA_50, BARRO_200).convert("RGBA")
    patron_lenca(imagen)

    dibujo = ImageDraw.Draw(imagen)

    # Banda inferior
    dibujo.rectangle([0, alto - 92, ancho, alto], fill=BARRO_800)

    # Marca
    marca(dibujo, 110, 112, 44)
    dibujo.text((170, 78), "Artesanías", font=cargar_fuente(FUENTES_SERIF, 76), fill=TINTA_900)
    dibujo.text(
        (174, 168),
        "D E   H O N D U R A S",
        font=cargar_fuente(FUENTES_SANS, 27),
        fill=BARRO_600,
    )

    centrar(
        dibujo,
        "Artesanía hecha a mano en Honduras",
        cargar_fuente(FUENTES_SERIF, 60),
        272,
        ancho,
        TINTA_900,
    )
    centrar(
        dibujo,
        "Barro lenca · textiles · joyería de tagua y plata",
        cargar_fuente(FUENTES_SANS, 30),
        356,
        ancho,
        TINTA_500,
    )

    for indice, color in enumerate([BARRO_500, OCRE_500, OLIVO_500]):
        rombo(dibujo, 540 + indice * 60, 444, 15, color)

    centrar(
        dibujo,
        "Envíos a todo Honduras y al extranjero · Pedidos por WhatsApp",
        cargar_fuente(FUENTES_SANS, 25),
        alto - 62,
        ancho,
        CREMA_200,
    )

    SALIDA_IMAGENES.mkdir(parents=True, exist_ok=True)
    destino = SALIDA_IMAGENES / "og-default.png"
    imagen.convert("RGB").save(destino, "PNG", optimize=True)
    return destino


def generar_icono() -> Path:
    """Icono de 180x180 para iOS."""
    lado = 180
    imagen = Image.new("RGBA", (lado, lado), CREMA_100)
    patron_lenca(imagen, lado=34, opacidad=0.12)

    dibujo = ImageDraw.Draw(imagen)
    marca(dibujo, lado / 2, lado / 2, lado * 0.35)

    destino = SALIDA_PUBLICA / "apple-touch-icon.png"
    imagen.convert("RGB").save(destino, "PNG", optimize=True)
    return destino


if __name__ == "__main__":
    ruta_og = generar_og()
    ruta_icono = generar_icono()
    print(f"OK {ruta_og.relative_to(RAIZ)} ({ruta_og.stat().st_size / 1024:.1f} KB)")
    print(f"OK {ruta_icono.relative_to(RAIZ)} ({ruta_icono.stat().st_size / 1024:.1f} KB)")
