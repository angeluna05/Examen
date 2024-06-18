import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class PhotoScreen extends StatefulWidget {
  @override
  _PhotoScreenState createState() => _PhotoScreenState();
}

class _PhotoScreenState extends State<PhotoScreen> {
  Uint8List? _imageBytes; // Variable para almacenar los bytes de la imagen capturada

  Future<void> _pickImage() async {
    try {
      final ImagePicker _picker = ImagePicker();
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);

      if (image != null) {
        // Lee los bytes de la imagen en Uint8List
        Uint8List bytes = await image.readAsBytes();

        setState(() {
          _imageBytes = bytes; // Actualiza los bytes de la imagen
        });
      }
    } catch (e) {
      print('Error tomando la foto: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tomar Foto'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          ElevatedButton(
            onPressed: _pickImage,
            child: Text('Tomar Foto'),
          ),
          SizedBox(height: 20),
          Expanded(
            child: Center(
              child: _imageBytes != null
                  ? Container(
                      margin: EdgeInsets.all(16.0),
                      height: 300,
                      width: 300,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Image.memory(
                        _imageBytes!, // Muestra la imagen usando los bytes en memoria
                        fit: BoxFit.cover,
                      ),
                    )
                  : Text(
                      'No se ha seleccionado ninguna imagen',
                      style: TextStyle(fontSize: 18.0),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: PhotoScreen(),
  ));
}
