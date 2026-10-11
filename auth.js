// 1. Configuramos Supabase para todo el proyecto
const SUPABASE_URL = 'https://leurovwytmfiicwhycpr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mrURZm4JhHxHbAoOLPC3Hw_bVCXmwhT';

// Lo guardamos en 'window' para que no pelee con otros archivos
window.clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Función que vigila que nadie entre sin permiso
async function verificarSesion() {
    const { data, error } = await window.clienteSupabase.auth.getSession();
    
    // Si no hay sesión, te expulsa al login
    if (error || !data.session) {
        window.location.replace("login.html");
    }
}

// 3. Función global para cerrar sesión desde cualquier página
window.cerrarSesion = async function() {
    const { error } = await window.clienteSupabase.auth.signOut();
    if (!error) {
        window.location.replace("login.html");
    } else {
        console.error("Error al salir:", error.message);
    }
};

// Se ejecuta el guardia automáticamente al abrir la página
verificarSesion();