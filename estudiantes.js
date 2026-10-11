// 1. Configura tus credenciales
const SUPABASE_URL = 'https://leurovwytmfiicwhycpr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mrURZm4JhHxHbAoOLPC3Hw_bVCXmwhT';

// Inicializar Supabase
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Función para leer TODOS los estudiantes
async function cargarEstudiantes() {
    try {
        // Hacemos el select a la tabla 'estudiantes' ordenado por apellidos
        const { data: estudiantes, error } = await clienteSupabase
            .from('estudiantes')
            .select('dni, nombres, apellidos')
            .order('apellidos', { ascending: true });

        if (error) throw error;

        const cuerpoTabla = document.getElementById('cuerpo-tabla-estudiantes');
        cuerpoTabla.innerHTML = ''; 

        estudiantes.forEach(est => {
            const fila = `
                <tr>
                    <td><strong>${est.dni}</strong></td>
                    <td>${est.apellidos}</td>
                    <td>${est.nombres}</td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error al cargar estudiantes:", error.message);
        document.getElementById('cuerpo-tabla-estudiantes').innerHTML = `<tr><td colspan="3" style="color:red;">Error cargando datos.</td></tr>`;
    }
}

// 3. Ejecutar al cargar la página
window.onload = cargarEstudiantes;