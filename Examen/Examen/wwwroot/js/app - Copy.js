document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'api/pago'; // Ruta base de la API

    // Cargar nombres de peajes desde la API externa al cargar la página
    fetch('https://www.datos.gov.co/resource/7gj8-j6i3.json')
        .then(response => response.json())
        .then(data => {
            const nombrePeajeSelect = document.getElementById('nombrePeaje');
            const peajes = data.map(item => item.peaje).filter((value, index, self) => self.indexOf(value) === index);
            peajes.forEach(peaje => {
                let option = document.createElement('option');
                option.value = peaje;
                option.textContent = peaje;
                nombrePeajeSelect.appendChild(option);
            });
        });

    const idCategoriaTarifaSelect = document.getElementById('idCategoriaTarifa');
    const nombrePeajeSelect = document.getElementById('nombrePeaje');
    const valorInput = document.getElementById('valor');

    idCategoriaTarifaSelect.addEventListener('change', updateValor);
    nombrePeajeSelect.addEventListener('change', updateValor);

    function updateValor() {
        const nombrePeaje = nombrePeajeSelect.value;
        const idCategoriaTarifa = idCategoriaTarifaSelect.value;

        if (nombrePeaje && idCategoriaTarifa) {
            fetch(`https://www.datos.gov.co/resource/7gj8-j6i3.json?peaje=${encodeURIComponent(nombrePeaje)}`)
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

    // Función para listar todos los pagos al cargar la página
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
                        <td>${pago.idCategoriaTarifa}</td>
                        <td>${pago.valor}</td>
                        <td>
                            <button class="btn btn-sm btn-info editarBtn" data-id="${pago.id}">Editar</button>
                            <button class="btn btn-sm btn-danger eliminarBtn" data-id="${pago.id}">Eliminar</button>
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

    // Llamar a la función para listar los pagos al cargar la página
    listarPagos();

    // Función para mostrar un pago seleccionado para edición
    function mostrarPagoParaEdicion(event) {
        const pagoId = event.target.dataset.id;

        fetch(`${baseUrl}/${pagoId}`)
            .then(response => response.json())
            .then(pago => {
                document.getElementById('placa').value = pago.placa;
                document.getElementById('nombrePeaje').value = pago.nombrePeaje;
                document.getElementById('idCategoriaTarifa').value = pago.idCategoriaTarifa;
                document.getElementById('valor').value = pago.valor;

                // Cambiar el botón de "Registrar" a "Actualizar"
                document.getElementById('registrarBtn').style.display = 'none';
                document.getElementById('actualizarBtn').style.display = 'inline';
                document.getElementById('eliminarBtn').dataset.id = pagoId; // Guardar ID de pago a eliminar
            })
            .catch(error => console.error('Error al obtener pago para edición:', error));
    }

    // Función para actualizar un pago
    document.getElementById('actualizarBtn').addEventListener('click', function () {
        const pagoId = document.getElementById('eliminarBtn').dataset.id; // Obtener ID del pago a actualizar
        const placaElement = document.getElementById('placa');
        const nombrePeajeElement = document.getElementById('nombrePeaje');
        const idCategoriaTarifaElement = document.getElementById('idCategoriaTarifa');
        const valorElement = document.getElementById('valor');
        const parsedPagoId = parseInt(pagoId); // Convertir el ID a entero, si es necesario
        const placa = placaElement.value;
        const nombrePeaje = nombrePeajeElement.value;
        const idCategoriaTarifa = idCategoriaTarifaElement.value;
        const valor = parseFloat(valorElement.value);

        const pago = {
            id: parsedPagoId,
            placa: placa,
            nombrePeaje: nombrePeaje,
            idCategoriaTarifa: idCategoriaTarifa,
            fechaRegistro: new Date().toISOString(),
            valor: valor
        };

        console.log(pago);

    });

    document.getElementById('actualizarBtn').addEventListener('click', function () {
        const pagoId = document.getElementById('eliminarBtn').dataset.id; // Obtener ID del pago a actualizar
        const placaElement = document.getElementById('placa');
        const nombrePeajeElement = document.getElementById('nombrePeaje');
        const idCategoriaTarifaElement = document.getElementById('idCategoriaTarifa');
        const valorElement = document.getElementById('valor');
        const parsedPagoId = parseInt(pagoId); // Convertir el ID a entero, si es necesario
        const placa = placaElement.value;
        const nombrePeaje = nombrePeajeElement.value;
        const idCategoriaTarifa = idCategoriaTarifaElement.value;
        const valor = parseFloat(valorElement.value);

        const pago = {
            id: parsedPagoId,
            placa: placa,
            nombrePeaje: nombrePeaje,
            idCategoriaTarifa: idCategoriaTarifa,
            fechaRegistro: new Date().toISOString(),
            valor: valor
        };
        // Aquí puedes continuar con el resto del código, como enviar la solicitud PUT
        fetch(`${baseUrl}/${pagoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pago)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parsear la respuesta JSON
            })
            .then(data => {
                // Verificar si la respuesta contiene algún dato (opcional, dependiendo de la respuesta del servidor)
                if (data) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Pago actualizado!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    limpiarFormulario();
                    listarPagos(); // Actualizar la lista de pagos
                } else {
                    console.error('Error al actualizar pago: Respuesta del servidor vacía');
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un problema al actualizar el pago. Por favor, intenta nuevamente más tarde.',
                        footer: 'Si el problema persiste, contacta al soporte técnico.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago actualizado!',
                    showConfirmButton: false,
                    timer: 1500
                });
                limpiarFormulario();
                listarPagos();
            });

    });

    // Función para eliminar un pago
    function eliminarPago(event) {
        const pagoId = event.target.dataset.id;

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir la eliminación de este pago!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${baseUrl}/${pagoId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Pago eliminado!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            listarPagos(); // Actualizar la lista de pagos
                        } else {
                            throw new Error('Error al eliminar el pago.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar pago:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Hubo un error al eliminar el pago.',
                            footer: 'Por favor, intenta nuevamente más tarde.'
                        });
                    });
            }
        });
    }

    // Función para limpiar el formulario después de operaciones exitosas
    function limpiarFormulario() {
        document.getElementById('placa').value = '';
        document.getElementById('nombrePeaje').value = '';
        document.getElementById('idCategoriaTarifa').value = 'I'; // Valor por defecto
        document.getElementById('valor').value = '';
        document.getElementById('registrarBtn').style.display = 'inline';
        document.getElementById('actualizarBtn').style.display = 'none';
        document.getElementById('eliminarBtn').removeAttribute('data-id'); // Limpiar ID de pago a eliminar
    }

    // Event listener para el formulario de registro de pago
    document.getElementById('pagoForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const placa = document.getElementById('placa').value;
        const nombrePeaje = document.getElementById('nombrePeaje').value;
        const idCategoriaTarifa = document.getElementById('idCategoriaTarifa').value;
        const valor = parseFloat(document.getElementById('valor').value);

        const pago = {
            placa,
            nombrePeaje,
            idCategoriaTarifa,
            fechaRegistro: new Date().toISOString(),
            valor
        };

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pago)
        })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago registrado exitosamente!',
                    showConfirmButton: false,
                    timer: 1500
                });
                limpiarFormulario();
                listarPagos(); // Actualizar la lista de pagos
            })
            .catch(error => {
                console.error('Error al registrar pago:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error al procesar el pago.',
                    footer: 'Por favor, intenta nuevamente más tarde.'
                });
            });
    });

    // Función para listar todos los pagos al cargar la página
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
                    <td>${pago.idCategoriaTarifa}</td>
                    <td>${pago.valor}</td>
                    <td>
                        <button class="btn btn-sm btn-info editarBtn" data-id="${pago.id}">Editar</button>
                        <button class="btn btn-sm btn-danger eliminarBtn" data-id="${pago.id}">Eliminar</button>
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

    // Llamar a la función para listar los pagos al cargar la página
    listarPagos();

    // Función para mostrar un pago seleccionado para edición
    function mostrarPagoParaEdicion(event) {
        const pagoId = event.target.dataset.id;

        fetch(`${baseUrl}/${pagoId}`)
            .then(response => response.json())
            .then(pago => {
                document.getElementById('placa').value = pago.placa;
                document.getElementById('nombrePeaje').value = pago.nombrePeaje;
                document.getElementById('idCategoriaTarifa').value = pago.idCategoriaTarifa;
                document.getElementById('valor').value = pago.valor;

                // Cambiar el botón de "Registrar" a "Actualizar"
                document.getElementById('registrarBtn').style.display = 'none';
                document.getElementById('actualizarBtn').style.display = 'inline';
                document.getElementById('eliminarBtn').dataset.id = pagoId; // Guardar ID de pago a eliminar
            })
            .catch(error => console.error('Error al obtener pago para edición:', error));
    }
});