/**
 * API Endpoint: GET /api/products
 * Este código se ejecuta en la red de Cloudflare (back-end).
 * Su trabajo es consultar la base de datos D1 y devolver
 * la lista de productos en formato JSON.
 */
export async function onRequest(context) {
    // Solo permitimos peticiones GET a este endpoint.
    if (context.request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Obtenemos la conexión a la base de datos D1 desde el entorno.
        // Cloudflare inyecta 'context.env.DB' automáticamente si lo configuras.
        const { D1 } = context.env;

        // Preparamos la consulta SQL para obtener todos los productos.
        const stmt = D1.prepare('SELECT id, title, category, price, image_url as image, stock FROM products');
        
        // Ejecutamos la consulta.
        const { results } = await stmt.all();

        // Creamos una respuesta exitosa con los resultados.
        // Es crucial devolver un objeto `Response` estándar.
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Añadimos cache para mejorar el rendimiento.
                'Cache-Control': 'public, max-age=600', 
            },
        });
        
    } catch (error) {
        // Si algo sale mal, devolvemos un error 500.
        console.error(error); // Loguea el error para depuración
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}