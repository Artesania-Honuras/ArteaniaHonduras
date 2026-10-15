---
titulo: Plantillas de la memoria
tipo: plantilla
tags:
  - proyecto
  - memoria
  - plantillas
actualizado: 2026-10-15
estado: vigente
---

# Plantillas

Formatos vacíos para que el registro sea consistente. Copia, rellena y **borra las líneas de
ayuda**. Ver [INDICE](INDICE.md) para las reglas.

---

## Plantilla de cambio (`C-NN`)

```markdown
### C-NN — Título corto en imperativo

- **Fecha:** AAAA-MM-DD
- **Commit:** `hash` (*"mensaje"*)
- **Alcance:** qué archivos o componentes toca
- **Estado:** aplicado y desplegado · aplicado sin desplegar · revertido

**Qué se hizo**
Una descripción de dos o tres líneas, en pasado.

**Por qué**
El problema concreto que resuelve. Si no había problema, no es un cambio: es una hipótesis.

**Evidencia**
| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
|  |  |  | `comando exacto` |

**Cómo revertirlo**
```bash
git revert <hash>          # o:
git checkout <hash>~1 -- ruta/del/archivo
```
Qué se pierde al revertir y qué hay que rehacer a mano.
```

---

## Plantilla de resultado (`E-NN`)

```markdown
### E-NN — Pregunta que se intentaba responder

- **Fecha:** AAAA-MM-DD
- **Hipótesis:** lo que se esperaba encontrar
- **Método:** herramienta, comando y condiciones exactas
- **n / ventana:** tamaño de la muestra y periodo medido
- **Veredicto:** ✅ confirmada · ❌ refutada · ⚠️ inconclusa

**Números**

| Medición | Valor |
| -------- | ----- |
|  |  |

**Conclusión**
Qué se hace a partir de ahora con este resultado. Si fue descartado, decirlo explícitamente para
no repetirlo.
```

---

## Plantilla de entrada de sesión

```markdown
### S-NN — AAAA-MM-DD · Título de la sesión

- **Objetivo declarado:** lo que se pidió al empezar
- **Duración:** ~X horas

**Qué se hizo**
Lista breve.

**Qué se rompió**
Errores que aparecieron y cómo se resolvieron. Si no se resolvió, va a "quedó abierto".

**Qué se decidió**
Decisiones tomadas y su motivo, con enlace a la entrada `C-NN` o `E-NN` si corresponde.

**Qué quedó abierto**
- [ ] Pendiente concreto, con su dueño si lo tiene

**Evidencia de cierre**
Tabla del checklist (`npm run estado`) o la medición que corresponda.
```

---

## Plantilla de entrada en el índice (decisión viva)

```markdown
| Decisión | Valor vigente | Evidencia | Desde |
| -------- | ------------- | --------- | ----- |
|  |  | `archivo:línea` o `comando` | C-NN |
```
