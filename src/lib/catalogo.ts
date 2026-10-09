import { z } from 'zod';
import { enlace } from '@/lib/rutas';

/** Iconos soportados por el generador de ilustraciones SVG. */
export const ICONOS = [
  'vasija',
  'canasta',
  'tejido',
  'hamaca',
  'bolso',
  'collar',
  'aretes',
  'pulsera',
  'madera',
  'muneca',
] as const;

export const CategoriaSchema = z.object({
  slug: z.string().min(2),
  nombre: z.string().min(2),
  descripcion: z.string().min(10),
  icono: z.enum(ICONOS),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'El color debe ser un hexadecimal de 6 dígitos, por ejemplo #B4522C'),
});

export const ProductoSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser kebab-case sin tildes ni espacios'),
  nombre: z.string().min(3),
  categoria: z.string().min(2),
  subtitulo: z.string().min(5).max(90),
  resumen: z.string().min(20).max(220),
  descripcion: z.array(z.string().min(40)).min(1),
  materiales: z.array(z.string().min(2)).min(1),
  medidas: z.string().min(3),
  cuidados: z.array(z.string().min(5)).min(1),
  origen: z.object({
    departamento: z.string().min(2),
    municipio: z.string().min(2),
    pueblo: z.string().default(''),
  }),
  taller: z.object({
    nombre: z.string().min(2),
    artesano: z.string().min(2),
    historia: z.string().min(10),
  }),
  tiempoElaboracion: z.string().min(3),
  personalizable: z.boolean(),
  destacado: z.boolean(),
  etiquetas: z.array(z.string().min(2)).min(1),
  colores: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(1).max(4),
  icono: z.enum(ICONOS),
  /** Precio en lempiras. Solo se muestra si FUNCIONES.mostrarPrecios es true. */
  precio: z.number().positive().optional(),
  /** Ruta de una fotografía real. Si falta, se usa la ilustración generada. */
  imagen: z.string().optional(),
  /** Galería adicional de fotografías reales. */
  galeria: z.array(z.string()).optional(),
  disponible: z.boolean().default(true),
  orden: z.number().default(50),
});

export type Categoria = z.infer<typeof CategoriaSchema>;
export type Producto = z.infer<typeof ProductoSchema>;

/** Producto con los campos derivados que consumen los componentes. */
export type ProductoVista = Producto & {
  categoriaNombre: string;
  categoriaColor: string;
  imagenPrincipal: string;
  imagenes: string[];
  ruta: string;
};

const modulosCategorias = import.meta.glob<{ default: unknown }>('../data/categorias.json', {
  eager: true,
});

const modulosProductos = import.meta.glob<{ default: unknown }>('../data/productos/*.json', {
  eager: true,
});

function validarCategorias(): Categoria[] {
  const entrada = Object.values(modulosCategorias)[0]?.default;
  if (!entrada) {
    throw new Error('No se encontró src/data/categorias.json');
  }

  const resultado = z.array(CategoriaSchema).safeParse(entrada);
  if (!resultado.success) {
    throw new Error(`categorias.json no es válido:\n${z.prettifyError(resultado.error)}`);
  }

  return resultado.data;
}

function validarProductos(categorias: Categoria[]): Producto[] {
  const slugsCategoria = new Set(categorias.map((c) => c.slug));
  const vistos = new Set<string>();
  const productos: Producto[] = [];

  for (const [rutaArchivo, modulo] of Object.entries(modulosProductos)) {
    const resultado = ProductoSchema.safeParse(modulo.default);

    if (!resultado.success) {
      throw new Error(
        `${rutaArchivo} no cumple el esquema de producto:\n${z.prettifyError(resultado.error)}`,
      );
    }

    const producto = resultado.data;

    if (vistos.has(producto.slug)) {
      throw new Error(`Slug de producto duplicado: "${producto.slug}" (revisa ${rutaArchivo})`);
    }
    vistos.add(producto.slug);

    if (!slugsCategoria.has(producto.categoria)) {
      throw new Error(
        `El producto "${producto.slug}" usa la categoría "${producto.categoria}", que no existe en categorias.json`,
      );
    }

    productos.push(producto);
  }

  return productos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}

export const categorias: Categoria[] = validarCategorias();

const productosBase: Producto[] = validarProductos(categorias);

/** Ilustración generada automáticamente a partir del slug del producto. */
export function ilustracionProducto(slug: string): string {
  return enlace(`/imagenes/productos/${slug}.svg`);
}

function aVista(producto: Producto): ProductoVista {
  const categoria = categorias.find((c) => c.slug === producto.categoria);
  const imagenes = [
    producto.imagen ?? ilustracionProducto(producto.slug),
    ...(producto.galeria ?? []),
  ];

  return {
    ...producto,
    categoriaNombre: categoria?.nombre ?? producto.categoria,
    categoriaColor: categoria?.color ?? '#B4522C',
    imagenPrincipal: imagenes[0]!,
    imagenes,
    ruta: enlace(`/producto/${producto.slug}/`),
  };
}

/** Catálogo completo listo para renderizar. */
export const productos: ProductoVista[] = productosBase.map(aVista);

export const productosDestacados: ProductoVista[] = productos.filter((p) => p.destacado);

export const etiquetasDisponibles: string[] = [
  ...new Set(productos.flatMap((p) => p.etiquetas)),
].sort((a, b) => a.localeCompare(b, 'es'));

export function productosPorCategoria(slugCategoria: string): ProductoVista[] {
  return productos.filter((p) => p.categoria === slugCategoria);
}

export function obtenerCategoria(slugCategoria: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slugCategoria);
}

export function obtenerProducto(slugProducto: string): ProductoVista | undefined {
  return productos.find((p) => p.slug === slugProducto);
}

export function categoriaPrincipal(producto: ProductoVista): Categoria {
  return obtenerCategoria(producto.categoria) ?? categorias[0]!;
}

/** Conteo de productos por categoría, para los contadores de la navegación. */
export function conteoPorCategoria(): Record<string, number> {
  return Object.fromEntries(
    categorias.map((c) => [c.slug, productosPorCategoria(c.slug).length]),
  );
}

/** Productos relacionados: misma categoría, excluyendo el actual. */
export function productosRelacionados(producto: ProductoVista, limite = 3): ProductoVista[] {
  return productosPorCategoria(producto.categoria)
    .filter((p) => p.slug !== producto.slug)
    .slice(0, limite);
}
