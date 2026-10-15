#!/usr/bin/env python3
"""
Checklist de estado del proyecto Artesanías De Honduras.

Recorre los componentes del proyecto y de su entorno e imprime una tabla con
✅ / ❌ / ⚠️ / ➖ y un veredicto final. Es la herramienta de medición del
proyecto: cuando alguien pregunta "¿está todo al 100%?", se corre esto y se
pega la tabla.

CARACTERÍSTICAS
  - Solo lectura: no escribe, no instala, no modifica nada.
  - Sin dependencias: únicamente la biblioteca estándar de Python 3.9+.
  - Devuelve código de salida 0 si no hay ningún ❌, y 1 si hay al menos uno.

USO
    python scripts/estado.py              # informe completo
    python scripts/estado.py --sin-red    # omite las comprobaciones de red
    python scripts/estado.py --json       # salida legible por máquina

NOTA SOBRE ESTE PROYECTO
    El sitio es estático y se sirve desde GitHub Pages: no hay demonios,
    procesos permanentes ni una máquina que deba estar encendida. Por eso no
    existe un "latido" que comprobar; la frescura se mide con la antigüedad del
    último commit, del último CI y del último despliegue, y el bloque de
    hardware queda marcado como no aplicable a la disponibilidad.
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# La consola de Windows usa cp1252 por defecto y no puede representar los
# símbolos ✅ ❌ ⚠️ ➖, lo que hacía fallar el informe justo al imprimirlo. Se
# fuerza UTF-8 con reemplazo para que la salida nunca sea motivo de error.
for _flujo in (sys.stdout, sys.stderr):
    try:
        _flujo.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):  # pragma: no cover
        pass

RAIZ = Path(__file__).resolve().parent.parent

SITIO = "https://artesania-honuras.github.io/ArteaniaHonduras"
DESARROLLO = "http://localhost:4321/ArteaniaHonduras/"

DIAS_ANTIGUEDAD_AVISO = 30
DIAS_ANTIGUEDAD_FALLO = 90
GB_DISCO_MINIMO = 5
MB_ARCHIVO_GRANDE = 5

MARCA_ACTUAL = "Artesanías De Honduras"
MARCA_ANTIGUA = "Arteanía"
WHATSAPP_MARCADOR = "50400000000"

OK, FALLO, AVISO, NA = "ok", "fallo", "aviso", "n/a"
ICONOS = {OK: "✅", FALLO: "❌", AVISO: "⚠️", NA: "➖"}

resultados: list[dict] = []
ahora = datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------

def anotar(bloque: str, componente: str, estado: str, detalle: str) -> None:
    resultados.append(
        {"bloque": bloque, "componente": componente, "estado": estado, "detalle": detalle}
    )


def ejecutar(comando: list[str], timeout: int = 60) -> tuple[int, str, str]:
    """
    Ejecuta un comando de solo lectura y devuelve (código, stdout, stderr).

    En Windows los ejecutables de npm son archivos `.cmd`, que CreateProcess no
    puede lanzar directamente: hay que pasarlos por cmd.exe.
    """
    orden = [str(parte) for parte in comando]
    if os.name == "nt" and orden and orden[0].lower().endswith((".cmd", ".bat")):
        orden = [os.environ.get("COMSPEC", "cmd.exe"), "/c", *orden]

    try:
        proceso = subprocess.run(
            orden,
            cwd=RAIZ,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
        return proceso.returncode, proceso.stdout or "", proceso.stderr or ""
    except FileNotFoundError:
        return 127, "", f"no se encontró el ejecutable: {orden[0]}"
    except subprocess.TimeoutExpired:
        return 124, "", f"agotó el tiempo de espera ({timeout}s)"
    except Exception as causa:  # noqa: BLE001
        return 1, "", str(causa)


def http_estado(url: str, timeout: int = 25) -> tuple[int | None, str]:
    """GET de solo lectura. Devuelve (código HTTP o None, detalle)."""
    peticion = urllib.request.Request(
        url,
        headers={
            "User-Agent": "estado-artesanias/1.0 (+comprobacion de disponibilidad)",
            "Accept": "*/*",
        },
    )
    try:
        inicio = time.monotonic()
        with urllib.request.urlopen(peticion, timeout=timeout) as respuesta:
            cuerpo = respuesta.read(400_000).decode("utf-8", errors="replace")
            ms = int((time.monotonic() - inicio) * 1000)
            return respuesta.status, f"{respuesta.status} en {ms} ms · {cuerpo}"
    except urllib.error.HTTPError as error:
        return error.code, f"HTTP {error.code}"
    except urllib.error.URLError as error:
        return None, f"sin conexión: {error.reason}"
    except Exception as causa:  # noqa: BLE001
        return None, str(causa)


def leer(ruta: str) -> str:
    try:
        return (RAIZ / ruta).read_text(encoding="utf-8")
    except Exception:  # noqa: BLE001
        return ""


# ---------------------------------------------------------------------------
# Bloque 1 — Procesos y servicios del proyecto
# ---------------------------------------------------------------------------

def bloque_procesos() -> None:
    bloque = "1. Procesos y servicios"

    anotar(
        bloque,
        "Demonios del proyecto",
        NA,
        "No aplica: sitio estático servido por GitHub Pages, sin procesos permanentes",
    )

    codigo, _ = http_estado(DESARROLLO, timeout=5)
    if codigo == 200:
        anotar(bloque, "Servidor local de desarrollo", OK, f"responde en {DESARROLLO}")
    else:
        anotar(
            bloque,
            "Servidor local de desarrollo",
            NA,
            "apagado (es normal: solo existe mientras se edita; no es un servicio del sitio)",
        )

    for herramienta, minimo in (("node", 20), ("npm", 10), ("git", 2), ("python", 3)):
        # `shutil.which` respeta PATHEXT, así que encuentra npm.cmd en Windows.
        ejecutable = shutil.which(herramienta)
        if not ejecutable:
            anotar(bloque, f"Herramienta {herramienta}", FALLO, "no está instalada o no está en PATH")
            continue
        codigo, salida, error = ejecutar([ejecutable, "--version"], timeout=30)
        version = (salida or error).strip().splitlines()[0] if (salida or error) else "?"
        numero = re.search(r"(\d+)\.", version)
        mayor = int(numero.group(1)) if numero else 0
        if mayor >= minimo:
            anotar(bloque, f"Herramienta {herramienta}", OK, version)
        else:
            anotar(bloque, f"Herramienta {herramienta}", AVISO, f"{version} (se espera >= {minimo}.x)")


# ---------------------------------------------------------------------------
# Bloque 2 — Conectividad con dependencias externas
# ---------------------------------------------------------------------------

def bloque_conectividad(sin_red: bool) -> None:
    bloque = "2. Conectividad externa"
    if sin_red:
        anotar(bloque, "Comprobaciones de red", NA, "omitidas con --sin-red")
        return

    servicios = [
        ("GitHub Pages — portada", f"{SITIO}/"),
        ("GitHub Pages — sitemap", f"{SITIO}/sitemap-index.xml"),
        ("GitHub Pages — robots.txt", f"{SITIO}/robots.txt"),
    ]
    for nombre, url in servicios:
        codigo, _ = http_estado(url)
        if codigo == 200:
            anotar(bloque, nombre, OK, "HTTP 200")
        else:
            anotar(bloque, nombre, FALLO, f"respuesta: {codigo}")

    codigo, _ = http_estado("https://registry.npmjs.org/-/ping")
    anotar(
        bloque,
        "Registro npm",
        OK if codigo == 200 else AVISO,
        f"HTTP {codigo}" + ("" if codigo == 200 else " (solo hace falta para instalar)"),
    )

    codigo_npm, salida, _ = ejecutar(["gh", "auth", "status"], timeout=30)
    anotar(
        bloque,
        "GitHub CLI autenticado",
        OK if codigo_npm == 0 else FALLO,
        "sesión activa" if codigo_npm == 0 else "sin sesión: no se puede consultar CI ni Pages",
    )

    numero = numero_whatsapp()
    if numero:
        codigo, _ = http_estado(f"https://wa.me/{numero}")
        anotar(
            bloque,
            "WhatsApp (canal de venta)",
            OK if codigo and codigo < 400 else FALLO,
            f"wa.me/{numero} responde HTTP {codigo}",
        )
    else:
        anotar(bloque, "WhatsApp (canal de venta)", FALLO, "no se pudo leer el número de site.ts")

    codigo, _ = http_estado("https://www.facebook.com/people/Artesanias-De-Honduras/100063559657469/")
    anotar(
        bloque,
        "Facebook (perfil público)",
        OK if codigo and codigo < 400 else AVISO,
        f"HTTP {codigo} (Facebook puede limitar peticiones automáticas; no es bloqueante)",
    )

    anotar(bloque, "Analítica, bots o paneles", NA, "el proyecto no usa ninguno")


# ---------------------------------------------------------------------------
# Bloque 3 — Frescura de la publicación
# ---------------------------------------------------------------------------

def edad_dias(iso: str) -> float | None:
    try:
        momento = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return (ahora - momento).total_seconds() / 86400
    except Exception:  # noqa: BLE001
        return None


def bloque_frescura(sin_red: bool) -> None:
    bloque = "3. Frescura de la publicación"

    codigo, salida, _ = ejecutar(["git", "log", "-1", "--format=%cI"], timeout=30)
    if codigo == 0 and salida.strip():
        dias = edad_dias(salida.strip())
        if dias is None:
            anotar(bloque, "Último commit", AVISO, "no se pudo interpretar la fecha")
        elif dias >= DIAS_ANTIGUEDAD_FALLO:
            anotar(bloque, "Último commit", FALLO, f"hace {dias:.0f} días")
        elif dias >= DIAS_ANTIGUEDAD_AVISO:
            anotar(bloque, "Último commit", AVISO, f"hace {dias:.0f} días sin cambios")
        else:
            anotar(bloque, "Último commit", OK, f"hace {dias:.1f} días")
    else:
        anotar(bloque, "Último commit", FALLO, "no se pudo leer el historial de git")

    if sin_red:
        anotar(bloque, "GitHub Actions", NA, "omitido con --sin-red")
        return

    codigo, salida, _ = ejecutar(
        [
            "gh",
            "run",
            "list",
            "--limit",
            "20",
            "--json",
            "name,status,conclusion,createdAt,headSha,workflowName",
        ],
        timeout=60,
    )
    if codigo != 0 or not salida.strip():
        anotar(bloque, "GitHub Actions", FALLO, "no se pudo consultar la API de GitHub")
        return

    try:
        ejecuciones = json.loads(salida)
    except json.JSONDecodeError:
        anotar(bloque, "GitHub Actions", FALLO, "respuesta ilegible de gh")
        return

    _, head, _ = ejecutar(["git", "rev-parse", "HEAD"], timeout=30)
    head = head.strip()

    def ultima(flujo: str) -> dict | None:
        for ejecucion in ejecuciones:
            if ejecucion.get("workflowName") == flujo:
                return ejecucion
        return None

    for flujo in ("Integración continua", "Desplegar en GitHub Pages"):
        ultima_ejecucion = ultima(flujo)
        if not ultima_ejecucion:
            anotar(bloque, flujo, AVISO, "sin ejecuciones registradas")
            continue
        conclusion = ultima_ejecucion.get("conclusion") or ultima_ejecucion.get("status")
        dias = edad_dias(ultima_ejecucion.get("createdAt", ""))
        hace = f"hace {dias:.1f} días" if dias is not None else "fecha desconocida"
        estado = OK if conclusion == "success" else FALLO
        anotar(bloque, flujo, estado, f"{conclusion} · {hace}")

    # ¿Lo publicado corresponde al código actual?
    despliegue = ultima("Desplegar en GitHub Pages")
    if despliegue:
        sha_desplegado = (despliegue.get("headSha") or "")[:7]
        sha_local = head[:7]
        if sha_desplegado and sha_local:
            if sha_desplegado == sha_local:
                anotar(bloque, "Despliegue al día", OK, f"lo publicado es el commit {sha_local}")
            else:
                anotar(
                    bloque,
                    "Despliegue al día",
                    FALLO,
                    f"publicado {sha_desplegado} pero el código local es {sha_local}",
                )

    if not sin_red:
        codigo, cuerpo = http_estado(f"{SITIO}/sitemap-0.xml")
        if codigo != 200:
            anotar(bloque, "Sitemap publicado", FALLO, f"HTTP {codigo}")
        else:
            rutas = re.findall(r"<loc>([^<]+)</loc>", cuerpo)
            anotar(bloque, "Sitemap publicado", OK, f"{len(rutas)} URLs declaradas")


# ---------------------------------------------------------------------------
# Bloque 4 — Integridad de la configuración viva
# ---------------------------------------------------------------------------

def numero_whatsapp() -> str:
    coincidencia = re.search(r"numero:\s*'([^']*)'", leer("src/config/site.ts"))
    return coincidencia.group(1) if coincidencia else ""


def bloque_configuracion(sin_red: bool) -> None:
    bloque = "4. Configuración viva"
    site = leer("src/config/site.ts")
    astro = leer("astro.config.mjs")

    # 4.1 Marca
    if MARCA_ACTUAL in site:
        anotar(bloque, "Marca en site.ts", OK, MARCA_ACTUAL)
    else:
        anotar(bloque, "Marca en site.ts", FALLO, f"no aparece «{MARCA_ACTUAL}»")

    if MARCA_ANTIGUA not in site:
        anotar(bloque, "Sin marca antigua en site.ts", OK, "no queda rastro")
    else:
        anotar(bloque, "Sin marca antigua en site.ts", FALLO, f"todavía contiene «{MARCA_ANTIGUA}»")

    # 4.2 WhatsApp
    numero = numero_whatsapp()
    if not numero:
        anotar(bloque, "Número de WhatsApp", FALLO, "no se pudo leer de site.ts")
    elif numero == WHATSAPP_MARCADOR:
        anotar(bloque, "Número de WhatsApp", FALLO, "sigue el marcador de ejemplo")
    elif re.fullmatch(r"\d{11,15}", numero):
        anotar(bloque, "Número de WhatsApp", OK, f"+{numero} (formato internacional correcto)")
    else:
        anotar(bloque, "Número de WhatsApp", FALLO, f"«{numero}» no es un formato válido")

    # 4.3 Coherencia del subdirectorio entre astro.config y site.ts
    base_astro = re.search(r"base:\s*'([^']*)'", astro)
    base_site = re.search(r"base:\s*'([^']*)'", site)
    if base_astro and base_site:
        if base_astro.group(1) == base_site.group(1):
            anotar(bloque, "Subdirectorio coherente", OK, f"base = {base_astro.group(1)}")
        else:
            anotar(
                bloque,
                "Subdirectorio coherente",
                FALLO,
                f"astro.config.mjs dice {base_astro.group(1)} y site.ts dice {base_site.group(1)}",
            )
    else:
        anotar(bloque, "Subdirectorio coherente", FALLO, "no se encontró el campo base")

    # 4.4 Catálogo
    codigo, salida, error = ejecutar(["node", "scripts/validar-catalogo.mjs"], timeout=120)
    if codigo == 0:
        productos = re.search(r"Productos analizados:\s*(\d+)", salida)
        categorias = re.search(r"Categorías:\s*(.+)", salida)
        anotar(
            bloque,
            "Catálogo válido",
            OK,
            f"{productos.group(1) if productos else '?'} productos · "
            f"{categorias.group(1).strip() if categorias else '?'}",
        )
    else:
        anotar(bloque, "Catálogo válido", FALLO, (error or salida).strip().splitlines()[-1:][0] if (error or salida) else "falló")

    # 4.5 Documentación obligatoria de la memoria
    for archivo in (
        "docs/memoria/INDICE.md",
        "docs/memoria/MANUAL-DE-CAMBIOS.md",
        "docs/memoria/REGISTRO-DE-RESULTADOS.md",
        "docs/memoria/LOG-DE-SESIONES.md",
        "docs/memoria/PLANTILLAS.md",
        "AGENTS.md",
    ):
        existe = (RAIZ / archivo).exists()
        anotar(bloque, f"Memoria: {archivo}", OK if existe else FALLO, "presente" if existe else "FALTA")

    # 4.6 Secretos
    versionados = ejecutar(["git", "ls-files"], timeout=60)[1].split()
    expuestos = [a for a in versionados if Path(a).name == ".env" or Path(a).name.startswith(".env.")]
    if expuestos:
        anotar(bloque, "Sin secretos versionados", FALLO, f"versionados: {', '.join(expuestos)}")
    else:
        anotar(bloque, "Sin secretos versionados", OK, "ningún .env rastreado por git")

    # 4.7 El número real llegó a lo publicado
    if not sin_red and numero:
        codigo, cuerpo = http_estado(f"{SITIO}/")
        if codigo == 200:
            if f"wa.me/{numero}" in cuerpo:
                anotar(bloque, "WhatsApp publicado", OK, "el número real está en el sitio en vivo")
            else:
                anotar(bloque, "WhatsApp publicado", FALLO, "el número real no aparece en el sitio publicado")
            if MARCA_ANTIGUA not in cuerpo:
                anotar(bloque, "Marca publicada", OK, "sin rastro del nombre antiguo")
            else:
                anotar(bloque, "Marca publicada", FALLO, "el sitio publicado conserva el nombre antiguo")


# ---------------------------------------------------------------------------
# Bloque 5 — Estado del repositorio
# ---------------------------------------------------------------------------

def bloque_repositorio() -> None:
    bloque = "5. Repositorio"

    _, salida, _ = ejecutar(["git", "status", "--porcelain"], timeout=60)
    pendientes = [linea for linea in salida.splitlines() if linea.strip()]
    if not pendientes:
        anotar(bloque, "Sin cambios pendientes", OK, "árbol de trabajo limpio")
    else:
        anotar(
            bloque,
            "Sin cambios pendientes",
            FALLO,
            f"{len(pendientes)} archivo(s): " + ", ".join(p[3:] for p in pendientes[:5]),
        )

    codigo, salida, _ = ejecutar(["git", "rev-parse", "HEAD"], timeout=30)
    head = salida.strip()
    codigo2, salida2, _ = ejecutar(["git", "rev-parse", "origin/master"], timeout=30)
    origin = salida2.strip()
    if codigo == 0 and codigo2 == 0 and head and origin:
        if head == origin:
            anotar(bloque, "Sincronizado con origin", OK, f"HEAD = origin/master = {head[:7]}")
        else:
            anotar(
                bloque,
                "Sincronizado con origin",
                FALLO,
                f"local {head[:7]} ≠ origin/master {origin[:7]} (falta subir o bajar)",
            )
    else:
        anotar(bloque, "Sincronizado con origin", FALLO, "no se pudo comparar con el remoto")

    # Archivos grandes rastreados
    grandes = []
    for archivo in ejecutar(["git", "ls-files"], timeout=60)[1].split():
        ruta = RAIZ / archivo
        try:
            tamano_mb = ruta.stat().st_size / (1024 * 1024)
            if tamano_mb > MB_ARCHIVO_GRANDE:
                grandes.append(f"{archivo} ({tamano_mb:.1f} MB)")
        except OSError:
            continue
    anotar(
        bloque,
        "Sin archivos grandes",
        OK if not grandes else AVISO,
        "ninguno mayor de 5 MB" if not grandes else ", ".join(grandes),
    )

    # Restos del repositorio original
    if (RAIZ / "index.html").exists() and "index.html" in ejecutar(["git", "ls-files"], timeout=60)[1]:
        anotar(bloque, "Sin HTML huérfano en la raíz", FALLO, "index.html sigue versionado")
    else:
        anotar(bloque, "Sin HTML huérfano en la raíz", OK, "la portada la genera Astro")


# ---------------------------------------------------------------------------
# Bloque 6 — Hardware y sistema operativo
# ---------------------------------------------------------------------------

def memoria_gb() -> tuple[float, float] | None:
    """(disponible, total) en GB, o None si no se puede medir. Solo lectura."""
    try:
        if hasattr(os, "sysconf") and "SC_AVPHYS_PAGES" in getattr(os, "sysconf_names", {}):
            paginas = os.sysconf("SC_PAGE_SIZE")
            return (
                os.sysconf("SC_AVPHYS_PAGES") * paginas / 1024**3,
                os.sysconf("SC_PHYS_PAGES") * paginas / 1024**3,
            )

        if os.name == "nt":
            import ctypes

            class MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]

            estado = MEMORYSTATUSEX()
            estado.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
            if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(estado)):
                return (estado.ullAvailPhys / 1024**3, estado.ullTotalPhys / 1024**3)
    except Exception:  # noqa: BLE001
        return None
    return None


def bloque_hardware() -> None:
    bloque = "6. Hardware y sistema"

    anotar(
        bloque,
        "Dependencia de esta máquina",
        NA,
        "el sitio se sirve desde GitHub Pages: no requiere que este equipo esté encendido",
    )

    anotar(bloque, "Sistema operativo", OK, f"{platform.system()} {platform.release()} ({platform.machine()})")

    try:
        uso = shutil.disk_usage(RAIZ)
        libres = uso.free / (1024**3)
        total = uso.total / (1024**3)
        estado = OK if libres >= GB_DISCO_MINIMO else FALLO
        anotar(bloque, "Espacio en disco", estado, f"{libres:.1f} GB libres de {total:.1f} GB")
    except Exception as causa:  # noqa: BLE001
        anotar(bloque, "Espacio en disco", AVISO, f"no se pudo medir: {causa}")

    memoria = memoria_gb()
    if memoria:
        disponibles, total = memoria
        anotar(bloque, "Memoria RAM", OK, f"{disponibles:.1f} GB disponibles de {total:.1f} GB")
    else:
        anotar(bloque, "Memoria RAM", NA, "no medible en esta plataforma con la biblioteca estándar")


# ---------------------------------------------------------------------------
# Informe
# ---------------------------------------------------------------------------

def imprimir_tabla() -> None:
    anchos = (28, 40, 4, 60)
    print()
    print(f"{'BLOQUE':<{anchos[0]}} {'COMPONENTE':<{anchos[1]}} {'':<{anchos[2]}} DETALLE")
    print("-" * 140)

    bloque_actual = None
    for fila in resultados:
        if fila["bloque"] != bloque_actual:
            bloque_actual = fila["bloque"]
            print(f"\n{bloque_actual}")
        print(
            f"{'':<{anchos[0]}} {fila['componente']:<{anchos[1]}} "
            f"{ICONOS[fila['estado']]:<{anchos[2]}} {fila['detalle']}"
        )


def main() -> int:
    analizador = argparse.ArgumentParser(description="Checklist de estado del proyecto.")
    analizador.add_argument("--sin-red", action="store_true", help="omite las comprobaciones de red")
    analizador.add_argument("--json", action="store_true", help="salida legible por máquina")
    opciones = analizador.parse_args()

    bloque_procesos()
    bloque_conectividad(opciones.sin_red)
    bloque_frescura(opciones.sin_red)
    bloque_configuracion(opciones.sin_red)
    bloque_repositorio()
    bloque_hardware()

    fallos = [r for r in resultados if r["estado"] == FALLO]
    avisos = [r for r in resultados if r["estado"] == AVISO]
    correctos = [r for r in resultados if r["estado"] == OK]
    no_aplica = [r for r in resultados if r["estado"] == NA]

    if opciones.json:
        print(
            json.dumps(
                {
                    "fecha": ahora.isoformat(),
                    "veredicto": "al 100%" if not fallos else "no al 100%",
                    "resumen": {
                        "correctos": len(correctos),
                        "fallos": len(fallos),
                        "avisos": len(avisos),
                        "no_aplica": len(no_aplica),
                    },
                    "resultados": resultados,
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 1 if fallos else 0

    print()
    print("=" * 140)
    print("ESTADO DEL PROYECTO — Artesanías De Honduras")
    print(f"Medido el {ahora.astimezone().strftime('%Y-%m-%d %H:%M:%S %Z')}")
    print("=" * 140)

    imprimir_tabla()

    print()
    print("=" * 140)
    print(
        f"RESUMEN: {len(correctos)} ✅   {len(fallos)} ❌   "
        f"{len(avisos)} ⚠️   {len(no_aplica)} ➖ (no aplica)"
    )

    if fallos:
        print()
        print("VEREDICTO: ❌ NO está al 100%. Bloqueantes:")
        for fila in fallos:
            print(f"  - [{fila['bloque']}] {fila['componente']}: {fila['detalle']}")
    else:
        print()
        print("VEREDICTO: ✅ Todo al 100% según los criterios definidos.")
        if avisos:
            print("Avisos no bloqueantes:")
            for fila in avisos:
                print(f"  - [{fila['bloque']}] {fila['componente']}: {fila['detalle']}")

    print("=" * 140)
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
