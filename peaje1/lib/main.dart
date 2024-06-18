import 'package:flutter/material.dart';
import 'package:peaje/screens/location.dart';
import 'screens/home_screen.dart';
import 'screens/crud_screen.dart';
import 'screens/photo_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter CRUD App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/crud': (context) => CrudScreen(),
        '/photo': (context) => PhotoScreen(),
        '/location': (context) => location(),
      },
    );
  }
}
