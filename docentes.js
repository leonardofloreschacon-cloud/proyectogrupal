// 1. Configura tus credenciales
const SUPABASE_URL = 'https://leurovwytmfiicwhycpr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mrURZm4JhHxHbAoOLPC3Hw_bVCXmwhT';

const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Función para leer los docentes
async function cargarDocentes() {
    try {
        // Hacemos el select a la tabla 'docentes' que me mostraste
        const { data: docentes, error } = await clienteSupabase
            .from('docentes')
            .select('dni, nombres, apellidos, telefono_contacto')
            .order('apellidos', { ascending: true });

        if (error) throw error;

        const cuerpoTabla = document.getElementById('cuerpo-tabla-docentes');
        cuerpoTabla.innerHTML = ''; 

        // Si no hay docentes todavía
        if(docentes.length === 0){
             cuerpoTabla.innerHTML = `<tr><td colspan="4" style="text-align:center;">Aún no hay docentes registrados.</td></tr>`;
             return;
        }

        docentes.forEach(doc => {
            const fila = `
                <tr>
                    <td><strong>${doc.dni || 'Sin DNI'}</strong></td>
                    <td>${doc.apellidos || ''}</td>
                    <td>${doc.nombres || ''}</td>
                    <td>${doc.telefono_contacto || 'No registrado'}</td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error al cargar docentes:", error.message);
        document.getElementById('cuerpo-tabla-docentes').innerHTML = `<tr><td colspan="4" style="color:red;">Error cargando datos: ${error.message}</td></tr>`;
    }
}

window.onload = cargarDocentes;