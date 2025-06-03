const express = require('express');
const path = require('path');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
    res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: null });
});

app.post('/admin/generate', async (req, res) => {
    const {
        name,
        email,
        fecha_nacimiento,
        direccion,
        alergias,
        grupo_sanguineo,
        telefono,
        emergencia_contacto
    } = req.body;

    if (!name) {
        return res.render('admin', {
            generatedUrl: null,
            qrCodeUrl: null,
            error: 'El nombre es obligatorio.',
        });
    }

    const userId = uuidv4().split('-')[0];
    const password = Math.random().toString(36).substring(2, 10);

    db.serialize(() => {
        db.run('BEGIN TRANSACTION;', async function(err) {
            if (err) {
                console.error('Error al iniciar la transacción:', err.message);
                return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error interno del servidor.' });
            }

            const userSql = `INSERT INTO Usuarios (id, contrasena, nombre, email) VALUES (?, ?, ?, ?)`;
            db.run(userSql, [userId, password, name, email], async function(err) {
                if (err) {
                    db.run('ROLLBACK;');
                    console.error('Error al insertar en Usuarios:', err.message);
                    return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error al guardar la información básica.' });
                }

                const personalInfoSql = `INSERT INTO InfoPersonal (usuario_id, fecha_nacimiento, direccion) VALUES (?, ?, ?)`;
                db.run(personalInfoSql, [userId, fecha_nacimiento, direccion], function(err) {
                    if (err) {
                        db.run('ROLLBACK;');
                        console.error('Error al insertar en InfoPersonal:', err.message);
                        return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error al guardar la información personal.' });
                    }

                    const healthInfoSql = `INSERT INTO InfoSalud (usuario_id, alergias, grupo_sanguineo) VALUES (?, ?, ?)`;
                    db.run(healthInfoSql, [userId, alergias, grupo_sanguineo], function(err) {
                        if (err) {
                            db.run('ROLLBACK;');
                            console.error('Error al insertar en InfoSalud:', err.message);
                            return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error al guardar la información de salud.' });
                        }

                        const contactInfoSql = `INSERT INTO Contactos (usuario_id, telefono, emergencia_contacto) VALUES (?, ?, ?)`;
                        db.run(contactInfoSql, [userId, telefono, emergencia_contacto], async function(err) {
                            if (err) {
                                db.run('ROLLBACK;');
                                console.error('Error al insertar en Contactos:', err.message);
                                return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error al guardar la información de contacto.' });
                            }

                            db.run('COMMIT;', async function(err) {
                                if (err) {
                                    console.error('Error al confirmar la transacción:', err.message);
                                    return res.render('admin', { generatedUrl: null, qrCodeUrl: null, error: 'Error interno del servidor.' });
                                }

                                const generatedUrl = `${req.protocol}://${req.get('host')}/${userId}?psw=${password}`;

                                try {
                                    const qrCodeDataUrl = await qrcode.toDataURL(generatedUrl);
                                    res.render('admin', {
                                        generatedUrl: generatedUrl,
                                        qrCodeUrl: qrCodeDataUrl,
                                        error: null,
                                    });
                                } catch (qrErr) {
                                    console.error('Error generando el QR:', qrErr);
                                    res.render('admin', {
                                        generatedUrl: generatedUrl,
                                        qrCodeUrl: null,
                                        error: 'Datos guardados, pero error al generar el código QR.',
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

app.get('/:userId', (req, res) => {
    const { userId } = req.params;
    const { psw } = req.query;

    if (!psw) {
        return res.status(401).render('error', { message: 'Acceso denegado. Se requiere contraseña.' });
    }

    const sql = `
        SELECT
            u.id,
            u.contrasena,
            u.nombre,
            u.email,
            pi.fecha_nacimiento,
            pi.direccion,
            hi.alergias,
            hi.grupo_sanguineo,
            co.telefono,
            co.emergencia_contacto
        FROM Usuarios u
        LEFT JOIN InfoPersonal pi ON u.id = pi.usuario_id
        LEFT JOIN InfoSalud hi ON u.id = hi.usuario_id
        LEFT JOIN Contactos co ON u.id = co.usuario_id
        WHERE u.id = ?
    `;

    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Error consultando la base de datos:', err.message);
            return res.status(500).render('error', { message: 'Error interno del servidor.' });
        }

        if (!row) {
            return res.status(404).render('error', { message: 'Usuario no encontrado.' });
        }

        if (row.contrasena === psw) {
            res.render('user_info', { user: row });
        } else {
            res.status(403).render('error', { message: 'Acceso denegado. Contraseña incorrecta.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.log(`Panel de Admin en http://localhost:${port}/admin`);
});