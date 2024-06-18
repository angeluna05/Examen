import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Menú Principal'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/vehiculo.jpg'),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildIcon(
                  context,
                  icon: Icons.settings,
                  label: 'CRUD Peajes',
                  route: '/crud',
                ),
                _buildIcon(
                  context,
                  icon: Icons.camera_alt,
                  label: 'Tomar Foto',
                  route: '/photo',
                ),
                _buildIcon(
                  context,
                  icon: Icons.location_on,
                  label: 'Geolocalización',
                  route: '/location',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIcon(BuildContext context, {required IconData icon, required String label, required String route}) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: Column(
        children: [
          Icon(icon, size: 60, color: Theme.of(context).primaryColor),
          SizedBox(height: 10),
          Text(
            label,
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
