# MAPA DEL PROYECTO → leer `docs/memoria/INDICE.md`

> Este archivo es lo primero que debe leer cualquier agente o persona que trabaje en este
> repositorio. Antes de tocar nada, lee el índice.

**Antes de empezar:** abre `docs/memoria/INDICE.md`. Contiene el estado real, las decisiones vivas,
las fuentes de verdad y los pendientes. No hay contexto fuera del repositorio.

---

## REGLA DE REGISTRO

**Todo cambio → `C-NN`. Todo experimento o medición → `E-NN`. Toda sesión → `Log de sesiones`.
Todo se commitea y se sube a Git en la misma sesión.**

- Ningún cambio se considera aplicado hasta que está en `docs/memoria/MANUAL-DE-CAMBIOS.md` **y**
  subido a `origin/master`.
- Ninguna medición se considera hecha hasta que está en `docs/memoria/REGISTRO-DE-RESULTADOS.md`
  con su hipótesis, su método, sus números y su veredicto.
- La memoria vive **solo** dentro de esta carpeta de proyecto, en archivos versionados. Prohibido
  usar memoria opaca de terceros.

## REGLA DE CAMBIOS

**Nada se cambia sin medición reproducible + validación fuera de muestra + registro + despliegue
verificado.**

Una idea sin resultado es una **hipótesis**, no una opción. Si no se puede medir todavía, se anota
como pendiente, nunca como hecho.

## REGLA DE ESTADO

**Cuando se pida "¿está todo al 100%?", hay que correr el checklist y pegar la tabla completa con
✅/❌, nunca responder "todo ok".**

```bash
npm run estado          # o: python scripts/estado.py
```

Debe incluir los servicios externos de los que depende el proyecto (GitHub Pages, GitHub Actions,
WhatsApp, Facebook) y declarar como `➖ no aplica` lo que no aplique, en lugar de omitirlo.

---

## Las tres reglas, en corto

| Regla | En una frase |
| ----- | ------------ |
| Registro | Cambio → C-NN · Experimento → E-NN · Sesión → Log · Todo commiteado y subido |
| Cambios | Sin medición, sin registro y sin despliegue verificado, no hay cambio |
| Estado | "¿100%?" se responde con la tabla del checklist, no con una opinión |

## Archivos de la memoria

| Archivo | Para qué |
| ------- | -------- |
| [`docs/memoria/INDICE.md`](docs/memoria/INDICE.md) | **Empieza aquí.** Mapa, reglas, decisiones vivas, criterios de aceptación y pendientes |
| [`docs/memoria/MANUAL-DE-CAMBIOS.md`](docs/memoria/MANUAL-DE-CAMBIOS.md) | Una entrada `C-NN` por cambio, con evidencia y reversión |
| [`docs/memoria/REGISTRO-DE-RESULTADOS.md`](docs/memoria/REGISTRO-DE-RESULTADOS.md) | Una fila `E-NN` por medición, incluidos los descartes |
| [`docs/memoria/LOG-DE-SESIONES.md`](docs/memoria/LOG-DE-SESIONES.md) | Bitácora de cada sesión |
| [`docs/memoria/PLANTILLAS.md`](docs/memoria/PLANTILLAS.md) | Formatos vacíos de C-NN, E-NN y sesión |

## Herramienta de medición

`scripts/estado.py` — checklist de solo lectura, sin dependencias, que recorre los seis bloques del
proyecto (servicios, conectividad, frescura, configuración, repositorio y hardware). Devuelve 0 si
no hay ningún ❌.
