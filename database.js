const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbDIR = path.resolve(__dirname, 'datosUsuarios.db');
const db = new sqlite3.Database(dbDIR, (err) => {
    if (err) {
        console.error('Error al abrir la DB', err.message);
    } else {
        console.log('Conectado a base de datos');

        db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
            id TEXT PRIMARY KEY,
            contrasena TEXT NOT NULL,
            nombre TEXT,
            email TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creando la tabla Usuarios:', err.message);
            } else {
                console.log('Tabla Usuarios creada o existente');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS InfoPersonal (
            usuario_id TEXT PRIMARY KEY,
            fecha_nacimiento TEXT,
            direccion TEXT,
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creando la tabla InfoPersonal:', err.message);
            } else {
                console.log('Tabla InfoPersonal creada o existente');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS InfoSalud (
            usuario_id TEXT PRIMARY KEY,
            alergias TEXT,
            grupo_sanguineo TEXT,
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creando la tabla InfoSalud:', err.message);
            } else {
                console.log('Tabla InfoSalud creada o existente');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS Contactos (
            usuario_id TEXT PRIMARY KEY,
            telefono TEXT,
            emergencia_contacto TEXT,
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creando la tabla Contactos:', err.message);
            } else {
                console.log('Tabla Contactos creada o existente');
            }
        });
    }
});

module.exports = db;