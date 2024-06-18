import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CrudScreen extends StatefulWidget {
  @override
  _CrudScreenState createState() => _CrudScreenState();
}

class _CrudScreenState extends State<CrudScreen> {
  final _formKey = GlobalKey<FormState>();
  final _placaController = TextEditingController();
  final _valorPeajeController = TextEditingController();
  String _nombrePeaje = '';
  String _idCategoriaTarifa = 'I';
  String _valorPeaje = '';
  String _editId = '';

  List<String> _peajes = ['Cargando...'];
  List<Map<String, dynamic>> _pagos = [];

  @override
  void initState() {
    super.initState();
    _fetchPeajes();
    _listarPagos();
  }

  Future<void> _fetchPeajes() async {
    try {
      final response = await http.get(Uri.parse('https://www.datos.gov.co/resource/7gj8-j6i3.json'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final peajes = data.map((item) => item['peaje']).toSet().toList();
        setState(() {
          _peajes = peajes.cast<String>();
          if (_peajes.isNotEmpty) {
            _nombrePeaje = _peajes.first;
          }
        });
      } else {
        throw Exception('Error al cargar los peajes: ${response.statusCode}');
      }
    } catch (e) {
      print('Error cargando peajes: $e');
      setState(() {
        _peajes = ['Error cargando peajes'];
      });
    }
  }

  Future<void> _listarPagos() async {
    final response = await http.get(Uri.parse('http://samgav0815-001-site1.atempurl.com/api/pago'));
    final data = json.decode(response.body);
    setState(() {
      _pagos = data.cast<Map<String, dynamic>>();
    });
  }

  Future<void> _fetchValorPeaje(String nombrePeaje, String idCategoriaTarifa) async {
    try {
      final response = await http.get(Uri.parse('https://www.datos.gov.co/resource/7gj8-j6i3.json'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final peaje = data.firstWhere(
          (item) => item['peaje'] == nombrePeaje && item['idcategoriatarifa'] == idCategoriaTarifa,
          orElse: () => null,
        );
        setState(() {
          _valorPeaje = peaje != null ? peaje['valor'] : '';
          _valorPeajeController.text = _valorPeaje;
        });
      } else {
        throw Exception('Error al obtener el valor del peaje: ${response.statusCode}');
      }
    } catch (e) {
      print('Error obteniendo valor del peaje: $e');
      setState(() {
        _valorPeaje = '';
        _valorPeajeController.text = '';
      });
    }
  }


void _editPago(Map<String, dynamic> pago) {
  setState(() {
    _editId = pago['id'].toString();
    _placaController.text = pago['placa'];
    _nombrePeaje = pago['nombrePeaje'];
    _idCategoriaTarifa = pago['idCategoriaTarifa'];
    _valorPeaje = pago['valor'].toString();
    _valorPeajeController.text = _valorPeaje; // Actualizar el controlador del campo de valor
  });
  _showFormModal();
}

Future<void> _submitForm() async {
  if (_formKey.currentState!.validate()) {
    final nuevoPago = {
      'placa': _placaController.text,
      'nombrePeaje': _nombrePeaje,
      'idCategoriaTarifa': _idCategoriaTarifa,
      'fechaRegistro': DateTime.now().toIso8601String(),
      'valor': _valorPeaje,
    };    

    http.Response response;
    if (_editId.isEmpty) {
      // Crear nuevo pago (POST)
      response = await http.post(
        Uri.parse('http://samgav0815-001-site1.atempurl.com/api/pago'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(nuevoPago),
      );
    } else {
          final editnuevoPago = {
      'id': _editId,
      'placa': _placaController.text,
      'nombrePeaje': _nombrePeaje,
      'idCategoriaTarifa': _idCategoriaTarifa,
      'fechaRegistro': DateTime.now().toIso8601String(),
      'valor': _valorPeaje,
    };
      // Editar pago existente (PUT)
      response = await http.put(
        Uri.parse('http://samgav0815-001-site1.atempurl.com/api/pago/$_editId'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(editnuevoPago),
      );
      _editId = ''; // Limpiar _editId después de la actualización
    }

    if (response.statusCode == 201 || response.statusCode == 200) {
      // Actualizar la lista de pagos y cerrar el modal
      _listarPagos();
      Navigator.of(context).pop(); // Cerrar el modal
    } else {
      // Mostrar mensaje de error si falla la solicitud
       _listarPagos();
      Navigator.of(context).pop(); 
    }
  }
}

Future<void> _deletePago(String id) async {
  final response = await http.delete(Uri.parse('http://samgav0815-001-site1.atempurl.com/api/pago/$id'));
  if (response.statusCode == 200) {
    _listarPagos();
  } else if (response.statusCode == 404) {
    _listarPagos();

  } else {
    _listarPagos();

  }
}


  void _showFormModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16.0,
            right: 16.0,
            top: 16.0,
          ),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                TextFormField(
                  controller: _placaController,
                  decoration: InputDecoration(labelText: 'Placa'),
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Campo obligatorio';
                    }
                    final regex = RegExp(r'^[A-Z]{3}[0-9]{3}$');
                    if (!regex.hasMatch(value)) {
                      return 'Formato inválido';
                    }
                    return null;
                  },
                ),
                DropdownButtonFormField<String>(
                  value: _nombrePeaje,
                  decoration: InputDecoration(labelText: 'Nombre Peaje'),
                  onChanged: (newValue) {
                    setState(() {
                      _nombrePeaje = newValue!;
                      _fetchValorPeaje(_nombrePeaje, _idCategoriaTarifa);
                    });
                  },
                  items: _peajes.map((peaje) {
                    return DropdownMenuItem(
                      value: peaje,
                      child: Text(peaje),
                    );
                  }).toList(),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Campo obligatorio';
                    }
                    return null;
                  },
                ),
                DropdownButtonFormField<String>(
                  value: _idCategoriaTarifa,
                  decoration: InputDecoration(labelText: 'Categoría Tarifa'),
                  onChanged: (newValue) {
                    setState(() {
                      _idCategoriaTarifa = newValue!;
                      _fetchValorPeaje(_nombrePeaje, _idCategoriaTarifa);
                    });
                  },
                  items: ['I', 'II', 'III', 'IV', 'V'].map((category) {
                    return DropdownMenuItem(
                      value: category,
                      child: Text(category),
                    );
                  }).toList(),
                ),
                TextFormField(
                  controller: _valorPeajeController,
                  decoration: InputDecoration(labelText: 'Valor'),
                  readOnly: true,
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _submitForm,
                  child: Text('Guardar'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('CRUD Peajes'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            Expanded(
              child: ListView.builder(
                itemCount: _pagos.length,
                itemBuilder: (context, index) {
                  final pago = _pagos[index];
                  return ListTile(
                    title: Text(pago['placa']),
                    subtitle: Text('${pago['nombrePeaje']} - ${pago['idCategoriaTarifa']}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit),
                          onPressed: () => _editPago(pago),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete),
                          onPressed: () => _deletePago(pago['id'].toString()),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _editId = ''; // Limpiar _editId al agregar nuevo pago
            _placaController.clear();
            _nombrePeaje = _peajes.isNotEmpty ? _peajes[0] : '';
            _idCategoriaTarifa = 'I';
            _valorPeaje = '';
            _valorPeajeController.text = _valorPeaje;
          });
          _showFormModal();
        },
        child: Icon(Icons.add),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text(
          'Tu Nombre Completo - Tu Número de Celular',
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
