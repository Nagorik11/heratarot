// Este código se ejecuta en el back-end de Cloudflare, no en el navegador.

export async function onRequest(context) {
    // context.env tiene acceso a tu base de datos D1
    const { D1 } = context.env;

    if (context.request.method !== 'POST') {
        return new Response('Método no permitido', { status: 405 });
    }

    try {
        const { email, password } = await context.request.json();

        // 1. Buscar el usuario en la base de datos D1
        const stmt = D1.prepare('SELECT * FROM users WHERE email = ?');
        const { results } = await stmt.bind(email).all();
        const user = results[0];

        // 2. Verificar usuario y contraseña (la contraseña debe estar encriptada!)
        if (!user || user.password !== password) { // En un caso real, usarías bcrypt.compare()
            return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // 3. Crear un token de sesión (simulado aquí)
        const token = `fake-session-token-for-${user.id}`;
        
        // 4. Devolver una respuesta exitosa
        return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso', token: token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response('Error interno del servidor', { status: 500 });
    }
}