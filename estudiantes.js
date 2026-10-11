// Función para leer TODOS los estudiantes
async function cargarEstudiantes() {
    try {
        // Usamos window.clienteSupabase para conectar con la base de datos
        const { data: estudiantes, error } = await window.clienteSupabase
            .from('estudiantes')
            .select('dni, nombres, apellidos')
            .order('apellidos', { ascending: true });

        if (error) throw error;

        const cuerpoTabla = document.getElementById('cuerpo-tabla-estudiantes');
        cuerpoTabla.innerHTML = ''; 

        // Si no hay estudiantes todavía
        if(estudiantes.length === 0){
             cuerpoTabla.innerHTML = `<tr><td colspan="3" style="text-align:center;">Aún no hay estudiantes registrados.</td></tr>`;
             return;
        }

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

// Ejecutar al cargar la página
window.onload = cargarEstudiantes;