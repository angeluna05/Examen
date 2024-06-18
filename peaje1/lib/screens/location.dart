import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';

class location extends StatefulWidget {
  @override
  _locationState createState() => _locationState();
}

class _locationState extends State<location> {
  late GoogleMapController mapController;
  final Location _location = Location();
  LatLng _initialPosition = LatLng(0.0, 0.0);

  bool _isLocationLoaded = false;

  @override
  void initState() {
    super.initState();
    _getUserLocation();
  }

  Future<void> _getUserLocation() async {
    try {
      var location = await _location.getLocation();
      setState(() {
        _initialPosition = LatLng(location.latitude!, location.longitude!);
        _isLocationLoaded = true;
      });
    } catch (e) {
      print('Error obteniendo la ubicación: $e');
    }
  }

 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Geolocalización'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: _isLocationLoaded
                ? GoogleMap(
                    onMapCreated: (GoogleMapController controller) {
                      mapController = controller;
                    },
                    initialCameraPosition: CameraPosition(
                      target: _initialPosition,
                      zoom: 15.0,
                    ),
                    myLocationEnabled: true,
                  )
                : Center(
                    child: CircularProgressIndicator(),
                  ),
          ),
        ],
      ),
    );
  }
}
