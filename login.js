// Credenciales de Supabase
const SUPABASE_URL = 'https://leurovwytmfiicwhycpr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mrURZm4JhHxHbAoOLPC3Hw_bVCXmwhT';
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('form-login').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje-login');

    mensaje.style.color = 'blue';
    mensaje.textContent = 'Verificando credenciales...';

    try {
        // Iniciar sesión
        const { data, error } = await clienteSupabase.auth.signInWithPassword({
            email: emailInput,
            password: passwordInput,
        });

        if (error) throw error;

        // Éxito: Mostrar mensaje y saltar a index.html
        mensaje.style.color = 'green';
        mensaje.textContent = '¡Acceso concedido!';
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);

    } catch (error) {
        console.error("Error en login:", error.message);
        mensaje.style.color = 'red';
        mensaje.textContent = 'Correo o contraseña incorrectos.';
    }
});