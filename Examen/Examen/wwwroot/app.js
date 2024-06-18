const baseUrl = 'api/pago';
const datosGovApiUrl = 'https://www.datos.gov.co/resource/7gj8-j6i3.json';

document.addEventListener('DOMContentLoaded', function () {
    // Cargar nombres de peajes en las listas desplegables de crear y editar
    cargarNombresPeajesSelect('nombrePeajeCrear');
    cargarNombresPeajesSelect('nombrePeajeEditar');

    // Event listeners para actualizar valor al seleccionar peaje y categoría de tarifa
    const idCategoriaTarifaCrearSelect = document.getElementById('idCategoriaTarifaCrear');
    const idCategoriaTarifaEditarSelect = document.getElementById('idCategoriaTarifaEditar');

    idCategoriaTarifaCrearSelect.addEventListener('change', () => updateValor('nombrePeajeCrear', idCategoriaTarifaCrearSelect.value, 'valorCrear'));
    idCategoriaTarifaEditarSelect.addEventListener('change', () => updateValor('nombrePeajeEditar', idCategoriaTarifaEditarSelect.value, 'valorEditar'));

    // Función para listar todos los pagos al cargar la página
    listarPagos();

    // Event listener para guardar nuevo pago desde modal de crear
    document.getElementById('guardarNuevoBtn').addEventListener('click', guardarNuevoPago);

    // Event listener para guardar cambios desde modal de editar
    document.getElementById('guardarCambiosBtn').addEventListener('click', guardarCambiosPago);
});

// Función para cargar nombres de peajes en listas desplegables
function cargarNombresPeajesSelect(elementId) {
    fetch(datosGovApiUrl)
        .then(response => response.json())
        .then(data => {
            const nombrePeajeSelect = document.getElementById(elementId);
            const peajes = data.map(item => item.peaje).filter((value, index, self) => self.indexOf(value) === index);
            peajes.forEach(peaje => {
                let option = document.createElement('option');
                option.value = peaje;
                option.textContent = peaje;
                nombrePeajeSelect.appendChild(option);
            });
        });
}

// Función para actualizar el valor del peaje al seleccionar peaje y categoría de tarifa
function updateValor(nombrePeajeId, idCategoriaTarifa, valorId) {
    const nombrePeajeSelect = document.getElementById(nombrePeajeId);
    const valorInput = document.getElementById(valorId);
    const nombrePeaje = nombrePeajeSelect.value;

    if (nombrePeaje && idCategoriaTarifa) {
        fetch(`${datosGovApiUrl}?peaje=${encodeURIComponent(nombrePeaje)}`)
            .then(response => response.json())
            .then(data => {
                const peaje = data.find(item => item.idcategoriatarifa === idCategoriaTarifa);
                if (peaje) {
                    valorInput.value = peaje.valor;
                } else {
                    valorInput.value = '';
                }
            });
    }
}

// Función para listar todos los pagos
function listarPagos() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(pagos => {
            const tablaBody = document.getElementById('tablaPagosBody');
            tablaBody.innerHTML = ''; // Limpiar contenido anterior

            pagos.forEach(pago => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pago.placa}</td>
                    <td>${pago.nombrePeaje}</td>
                    <td>${pago.categoriaTarifa}</td>
                    <td>${pago.valor}</td>
                    <td>
                        <button class="btn btn-sm btn-info editarBtn" data-id="${pago.idPeaje}" data-toggle="modal" data-target="#editarModal">Editar</button>
                        <button class="btn btn-sm btn-danger eliminarBtn" data-id="${pago.idPeaje}">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(row);
            });

            // Agregar event listeners a los botones de editar y eliminar
            const editarBtns = document.querySelectorAll('.editarBtn');
            editarBtns.forEach(btn => {
                btn.addEventListener('click', mostrarPagoParaEdicion);
            });

            const eliminarBtns = document.querySelectorAll('.eliminarBtn');
            eliminarBtns.forEach(btn => {
                btn.addEventListener('click', eliminarPago);
            });
        })
        .catch(error => console.error('Error al obtener pagos:', error));
}

// Función para mostrar un pago seleccionado para edición
function mostrarPagoParaEdicion(event) {
    const pagoId = event.target.dataset.id;

    fetch(`${baseUrl}/${pagoId}`)
        .then(response => response.json())
        .then(pago => {
            document.getElementById('placaEditar').value = pago.placa;
            document.getElementById('nombrePeajeEditar').value = pago.nombrePeaje;
            document.getElementById('idCategoriaTarifaEditar').value = pago.categoriaTarifa;
            document.getElementById('valorEditar').value = pago.valor;

            // Guardar ID del pago en el botón de guardar cambios
            document.getElementById('guardarCambiosBtn').setAttribute('data-id', pagoId);
        })
        .catch(error => console.error('Error al obtener pago para edición:', error));
}

// Función para guardar un nuevo pago desde modal de crear
function guardarNuevoPago() {
    const placa = document.getElementById('placaCrear').value;
    const nombrePeaje = document.getElementById('nombrePeajeCrear').value;
    const idCategoriaTarifa = document.getElementById('idCategoriaTarifaCrear').value;
    const valor = parseFloat(document.getElementById('valorCrear').value);

    const pago = {
        idPeaje: 1,
        placa,
        nombrePeaje,
        categoriaTarifa: idCategoriaTarifa, // Ajustado a la propiedad correcta
        fechaRegistro: new Date().toISOString(),
        valor
    };

    console.log(pago); // Imprimir el objeto pago en la consola

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pago)
    })
        .then(response => response.json())
        .then(data => {
            $('#crearModal').modal('hide'); // Cerrar modal de crear
            listarPagos(); // Actualizar la lista de pagos
        })
        .catch(error => {
            console.error('Error al guardar cambios en el pago:', error);
            $('#crearModal').modal('hide'); // Cerrar modal de editar en caso de error
            listarPagos(); // Actualizar la lista de pagos incluso si hay error
        }); }

// Función para guardar cambios en un pago desde modal de editar
function guardarCambiosPago() {
    const pagoId = document.getElementById('guardarCambiosBtn').getAttribute('data-id');
    const placa = document.getElementById('placaEditar').value;
    const nombrePeaje = document.getElementById('nombrePeajeEditar').value;
    const idCategoriaTarifa = document.getElementById('idCategoriaTarifaEditar').value;
    const valor = parseFloat(document.getElementById('valorEditar').value);

    const pago = {
        idPeaje:pagoId,
        placa,
        nombrePeaje,
        categoriaTarifa: idCategoriaTarifa, // Ajustado a la propiedad correcta
        fechaRegistro: new Date().toISOString(),
        valor
    };

    console.log(pago); // Imprimir el objeto pago en la consola

    fetch(`${baseUrl}/${pagoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pago)
    })
        .then(response => response.json())
        .then(data => {
            $('#editarModal').modal('hide'); // Cerrar modal de editar
            listarPagos(); // Actualizar la lista de pagos
        })
        .catch(error => {
            console.error('Error al guardar cambios en el pago:', error);
            $('#editarModal').modal('hide'); // Cerrar modal de editar en caso de error
            listarPagos(); // Actualizar la lista de pagos incluso si hay error
        });
}

// Función para eliminar un pago
function eliminarPago(event) {
    const pagoId = event.target.dataset.id;

    fetch(`${baseUrl}/${pagoId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                listarPagos(); // Actualizar la lista de pagos
            } else {
                throw new Error('Error al eliminar el pago.');
            }
        })
        .catch(error => console.error('Error al eliminar pago:', error));
}
