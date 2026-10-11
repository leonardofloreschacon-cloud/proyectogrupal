// 1. Configura tus credenciales
const SUPABASE_URL = 'https://leurovwytmfiicwhycpr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mrURZm4JhHxHbAoOLPC3Hw_bVCXmwhT';

// Inicializar Supabase
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Función para leer las matrículas (Llena la tabla y la tarjeta)
async function cargarMatriculas() {
    try {
        const { data: matriculas, error } = await clienteSupabase
            .from('matriculas')
            .select(`
                id,
                fecha_matricula,
                estado,
                estudiantes (nombres, apellidos),
                grados_secciones (grado, seccion)
            `)
            .order('fecha_matricula', { ascending: false });

        if (error) throw error;

        const cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ''; 

        document.getElementById('total-matriculas').textContent = matriculas.length;

        matriculas.forEach(mat => {
            const fila = `
                <tr>
                    <td>${mat.id.substring(0, 8)}...</td>
                    <td>${mat.estudiantes.apellidos}, ${mat.estudiantes.nombres}</td>
                    <td>${mat.grados_secciones.grado} ${mat.grados_secciones.seccion}</td>
                    <td>${mat.fecha_matricula}</td>
                    <td><strong style="color: green;">${mat.estado}</strong></td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error al cargar datos:", error.message);
        document.getElementById('cuerpo-tabla').innerHTML = `<tr><td colspan="5">Error cargando datos.</td></tr>`;
    }
}

// Ejecutar al cargar la página
window.onload = cargarMatriculas;


// 3. Función del Formulario 1: Registrar Nuevo Estudiante
document.getElementById('form-estudiante').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const nombresInput = document.getElementById('nombres').value;
    const apellidosInput = document.getElementById('apellidos').value;
    const dniInput = document.getElementById('dni').value;
    const mensaje = document.getElementById('mensaje-form');

    mensaje.style.color = 'blue';
    mensaje.textContent = 'Guardando en la base de datos...';

    try {
        const { error } = await clienteSupabase
            .from('estudiantes')
            .insert([
                { nombres: nombresInput, apellidos: apellidosInput, dni: dniInput }
            ]);

        if (error) throw error; 

        mensaje.style.color = 'green';
        mensaje.textContent = '¡Estudiante guardado! Ahora puedes matricularlo en el panel de abajo.';
        document.getElementById('form-estudiante').reset(); 
        
    } catch (error) {
        console.error("Error al guardar:", error.message);
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error: ' + error.message;
    }
});


// 4. Función del Formulario 2: Matricular Estudiante Existente
document.getElementById('form-matricula').addEventListener('submit', async function(e) {
    e.preventDefault();

    const dniInput = document.getElementById('dni-matricula').value;
    const gradoInput = document.getElementById('grado-matricula').value;
    const mensaje = document.getElementById('mensaje-matricula');

    mensaje.style.color = 'blue';
    mensaje.textContent = 'Procesando matrícula...';

    try {
        // PASO A: Buscar el ID oculto del estudiante usando su DNI
        const { data: estudiante, error: errorBusqueda } = await clienteSupabase
            .from('estudiantes')
            .select('id')
            .eq('dni', dniInput)
            .single(); 

        if (errorBusqueda) throw new Error("No se encontró ningún estudiante con ese DNI.");

        const idEstudiante = estudiante.id;

        // PASO B: Guardar la matrícula oficial
        const { error: errorMatricula } = await clienteSupabase
            .from('matriculas')
            .insert([
                { 
                    estudiante_id: idEstudiante, 
                    grado_seccion_id: gradoInput,
                    estado: 'Activo'
                }
            ]);

        if (errorMatricula) throw errorMatricula;

        // Si todo sale bien
        mensaje.style.color = 'green';
        mensaje.textContent = '¡Matrícula registrada exitosamente!';
        document.getElementById('form-matricula').reset();
        
        // Actualizamos la tabla principal al instante
        cargarMatriculas();

    } catch (error) {
        console.error("Error en matrícula:", error.message);
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error: ' + error.message;
    }
});