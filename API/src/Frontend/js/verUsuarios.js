
// Obtener y mostrar los usuarios en una tabla
function listarUsuarios() {
    fetch('http://localhost:8000/api/usuario/listar')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('usuariosBody');
            data.forEach(usuario => {
                let row = `<tr>
                    <td>${usuario.nombres}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.email}</td>
                    <td class="scrollable">${usuario.password}</td>
                    <td>${usuario.pais}</td>
                    <td>${usuario.genero}</td>
                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
        });
}

// Ejecutar la función cuando se cargue la página
window.onload = listarUsuarios;
