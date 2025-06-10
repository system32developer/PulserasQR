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
app.get('/defecto', (req, res) => {
    const defaultUsers = [
        {
            id: '54569aba',
            contrasena: '0qeyg9g0',
            nombre: 'Carlos Martínez',
            email: 'carlos.martinez@example.com',
            fecha_nacimiento: '1992-03-15',
            direccion: 'Av. 27 de Febrero #101',
            alergias: 'Ninguna',
            grupo_sanguineo: 'A+',
            telefono: '8091230001',
            emergencia_contacto: 'Laura Martínez - 8091231001'
        },
        {
            id: '54569abb',
            contrasena: '0qeyg9g0',
            nombre: 'María Rodríguez',
            email: 'maria.rodriguez@example.com',
            fecha_nacimiento: '1988-07-09',
            direccion: 'Calle El Sol #45',
            alergias: 'Penicilina',
            grupo_sanguineo: 'B+',
            telefono: '8091230002',
            emergencia_contacto: 'Pedro Rodríguez - 8091231002'
        },
        {
            id: '54569abc',
            contrasena: '0qeyg9g0',
            nombre: 'José Ramírez',
            email: 'jose.ramirez@example.com',
            fecha_nacimiento: '1995-12-02',
            direccion: 'Calle Duarte #12',
            alergias: 'Ninguna',
            grupo_sanguineo: 'O-',
            telefono: '8091230003',
            emergencia_contacto: 'Ana Ramírez - 8091231003'
        },
        {
            id: '54569abd',
            contrasena: '0qeyg9g0',
            nombre: 'Laura Fernández',
            email: 'laura.fernandez@example.com',
            fecha_nacimiento: '1993-10-20',
            direccion: 'Residencial Los Álamos',
            alergias: 'Polvo',
            grupo_sanguineo: 'AB+',
            telefono: '8091230004',
            emergencia_contacto: 'Julio Fernández - 8091231004'
        },
        {
            id: '54569abe',
            contrasena: '0qeyg9g0',
            nombre: 'David Sánchez',
            email: 'david.sanchez@example.com',
            fecha_nacimiento: '1990-06-30',
            direccion: 'Av. Independencia #77',
            alergias: 'Ninguna',
            grupo_sanguineo: 'A-',
            telefono: '8091230005',
            emergencia_contacto: 'Carmen Sánchez - 8091231005'
        },
        {
            id: '54569abf',
            contrasena: '0qeyg9g0',
            nombre: 'Ana López',
            email: 'ana.lopez@example.com',
            fecha_nacimiento: '1987-11-14',
            direccion: 'Calle Central #23',
            alergias: 'Mariscos',
            grupo_sanguineo: 'O+',
            telefono: '8091230006',
            emergencia_contacto: 'Luis López - 8091231006'
        },
        {
            id: '54569abg',
            contrasena: '0qeyg9g0',
            nombre: 'Pedro Castillo',
            email: 'pedro.castillo@example.com',
            fecha_nacimiento: '1998-08-08',
            direccion: 'Villa Juana, Sto. Dgo.',
            alergias: 'Ninguna',
            grupo_sanguineo: 'B-',
            telefono: '8091230007',
            emergencia_contacto: 'Marta Castillo - 8091231007'
        },
        {
            id: '54569abh',
            contrasena: '0qeyg9g0',
            nombre: 'Sofía Herrera',
            email: 'sofia.herrera@example.com',
            fecha_nacimiento: '1996-01-11',
            direccion: 'Ensanche La Fe',
            alergias: 'Polen',
            grupo_sanguineo: 'AB-',
            telefono: '8091230008',
            emergencia_contacto: 'José Herrera - 8091231008'
        },
        {
            id: '54569abi',
            contrasena: '0qeyg9g0',
            nombre: 'Luis Gómez',
            email: 'luis.gomez@example.com',
            fecha_nacimiento: '1989-04-27',
            direccion: 'Calle Las Palmas #88',
            alergias: 'Gluten',
            grupo_sanguineo: 'O+',
            telefono: '8091230009',
            emergencia_contacto: 'Gloria Gómez - 8091231009'
        },
        {
            id: '54569abj',
            contrasena: '0qeyg9g0',
            nombre: 'Carmen Peña',
            email: 'carmen.pena@example.com',
            fecha_nacimiento: '1994-09-19',
            direccion: 'Zona Colonial #4',
            alergias: 'Ninguna',
            grupo_sanguineo: 'A+',
            telefono: '8091230010',
            emergencia_contacto: 'Ramón Peña - 8091231010'
        },
        {
            id: '54569abk',
            contrasena: '0qeyg9g0',
            nombre: 'Andrés Méndez',
            email: 'andres.mendez@example.com',
            fecha_nacimiento: '1991-02-05',
            direccion: 'Ciudad Nueva',
            alergias: 'Frutos secos',
            grupo_sanguineo: 'B+',
            telefono: '8091230011',
            emergencia_contacto: 'Teresa Méndez - 8091231011'
        },
        {
            id: '54569abl',
            contrasena: '0qeyg9g0',
            nombre: 'Patricia Cruz',
            email: 'patricia.cruz@example.com',
            fecha_nacimiento: '1986-06-06',
            direccion: 'Av. Bolívar #56',
            alergias: 'Lácteos',
            grupo_sanguineo: 'O-',
            telefono: '8091230012',
            emergencia_contacto: 'Héctor Cruz - 8091231012'
        },
        {
            id: '54569abm',
            contrasena: '0qeyg9g0',
            nombre: 'Raúl Torres',
            email: 'raul.torres@example.com',
            fecha_nacimiento: '1997-07-07',
            direccion: 'Villa Mella',
            alergias: 'Picaduras de insectos',
            grupo_sanguineo: 'AB+',
            telefono: '8091230013',
            emergencia_contacto: 'Juana Torres - 8091231013'
        },
        {
            id: '54569abn',
            contrasena: '0qeyg9g0',
            nombre: 'Isabel Vargas',
            email: 'isabel.vargas@example.com',
            fecha_nacimiento: '1993-12-25',
            direccion: 'Hermanas Mirabal',
            alergias: 'Ninguna',
            grupo_sanguineo: 'A-',
            telefono: '8091230014',
            emergencia_contacto: 'Rafael Vargas - 8091231014'
        },
        {
            id: '54569abo',
            contrasena: '0qeyg9g0',
            nombre: 'Fernando Reyes',
            email: 'fernando.reyes@example.com',
            fecha_nacimiento: '1985-03-10',
            direccion: 'Av. Sarasota',
            alergias: 'Ninguna',
            grupo_sanguineo: 'B-',
            telefono: '8091230015',
            emergencia_contacto: 'Elena Reyes - 8091231015'
        },
        {
            id: '54569abp',
            contrasena: '0qeyg9g0',
            nombre: 'Yolanda Cabrera',
            email: 'yolanda.cabrera@example.com',
            fecha_nacimiento: '1990-08-18',
            direccion: 'Los Alcarrizos',
            alergias: 'Penicilina',
            grupo_sanguineo: 'O+',
            telefono: '8091230016',
            emergencia_contacto: 'Luis Cabrera - 8091231016'
        },
        {
            id: '54569abq',
            contrasena: '0qeyg9g0',
            nombre: 'Daniel Peralta',
            email: 'daniel.peralta@example.com',
            fecha_nacimiento: '1992-11-22',
            direccion: 'San Isidro',
            alergias: 'Mariscos',
            grupo_sanguineo: 'AB-',
            telefono: '8091230017',
            emergencia_contacto: 'Laura Peralta - 8091231017'
        },
        {
            id: '54569abr',
            contrasena: '0qeyg9g0',
            nombre: 'Lucía Méndez',
            email: 'lucia.mendez@example.com',
            fecha_nacimiento: '1989-05-12',
            direccion: 'Piantini',
            alergias: 'Polvo',
            grupo_sanguineo: 'A+',
            telefono: '8091230018',
            emergencia_contacto: 'José Méndez - 8091231018'
        },
        {
            id: '54569abs',
            contrasena: '0qeyg9g0',
            nombre: 'Jorge Castillo',
            email: 'jorge.castillo@example.com',
            fecha_nacimiento: '1996-02-28',
            direccion: 'Naco',
            alergias: 'Gluten',
            grupo_sanguineo: 'B+',
            telefono: '8091230019',
            emergencia_contacto: 'Marta Castillo - 8091231019'
        },
        {
            id: '54569abt',
            contrasena: '0qeyg9g0',
            nombre: 'Paola Guzmán',
            email: 'paola.guzman@example.com',
            fecha_nacimiento: '1994-10-01',
            direccion: 'Zona Universitaria',
            alergias: 'Frutos secos',
            grupo_sanguineo: 'O-',
            telefono: '8091230020',
            emergencia_contacto: 'Carlos Guzmán - 8091231020'
        },
        {
            id: '54569abu',
            contrasena: '0qeyg9g0',
            nombre: 'Ricardo Peña',
            email: 'ricardo.pena@example.com',
            fecha_nacimiento: '1988-09-03',
            direccion: 'El Millón',
            alergias: 'Ninguna',
            grupo_sanguineo: 'AB+',
            telefono: '8091230021',
            emergencia_contacto: 'Carmen Peña - 8091231021'
        },
        {
            id: '54569abv',
            contrasena: '0qeyg9g0',
            nombre: 'Daniela Ramírez',
            email: 'daniela.ramirez@example.com',
            fecha_nacimiento: '1997-01-17',
            direccion: 'Gascue',
            alergias: 'Picaduras de insectos',
            grupo_sanguineo: 'A-',
            telefono: '8091230022',
            emergencia_contacto: 'Carlos Ramírez - 8091231022'
        },
        {
            id: '54569abw',
            contrasena: '0qeyg9g0',
            nombre: 'Emilio Navarro',
            email: 'emilio.navarro@example.com',
            fecha_nacimiento: '1991-04-04',
            direccion: 'Bello Campo',
            alergias: 'Polen',
            grupo_sanguineo: 'B-',
            telefono: '8091230023',
            emergencia_contacto: 'Julia Navarro - 8091231023'
        },
        {
            id: '54569abx',
            contrasena: '0qeyg9g0',
            nombre: 'Gabriela Núñez',
            email: 'gabriela.nunez@example.com',
            fecha_nacimiento: '1995-07-26',
            direccion: 'La Esperilla',
            alergias: 'Lácteos',
            grupo_sanguineo: 'O+',
            telefono: '8091230024',
            emergencia_contacto: 'Francisco Núñez - 8091231024'
        },
        {
            id: '54569aby',
            contrasena: '0qeyg9g0',
            nombre: 'Héctor Morales',
            email: 'hector.morales@example.com',
            fecha_nacimiento: '1993-08-06',
            direccion: 'Mirador Sur',
            alergias: 'Penicilina',
            grupo_sanguineo: 'A+',
            telefono: '8091230025',
            emergencia_contacto: 'Ana Morales - 8091231025'
        },
        {
            id: '54569abz',
            contrasena: '0qeyg9g0',
            nombre: 'Natalia Espinal',
            email: 'natalia.espinal@example.com',
            fecha_nacimiento: '1990-12-30',
            direccion: 'Renacimiento',
            alergias: 'Ninguna',
            grupo_sanguineo: 'B+',
            telefono: '8091230026',
            emergencia_contacto: 'Luis Espinal - 8091231026'
        }
    ];


    let inserted = 0;
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const checkSql = 'SELECT 1 FROM Usuarios WHERE id = ?';

        const insertUserSql = 'INSERT INTO Usuarios (id, contrasena, nombre, email) VALUES (?, ?, ?, ?)';
        const insertPersonalSql = 'INSERT INTO InfoPersonal (usuario_id, fecha_nacimiento, direccion) VALUES (?, ?, ?)';
        const insertSaludSql = 'INSERT INTO InfoSalud (usuario_id, alergias, grupo_sanguineo) VALUES (?, ?, ?)';
        const insertContactSql = 'INSERT INTO Contactos (usuario_id, telefono, emergencia_contacto) VALUES (?, ?, ?)';

        defaultUsers.forEach((user, index) => {
            db.get(checkSql, [user.id], (err, row) => {
                if (err) {
                    console.error(`Error verificando existencia de usuario ${user.id}:`, err.message);
                    return;
                }

                if (!row) {
                    db.run(insertUserSql, [user.id, user.contrasena, user.nombre, user.email]);
                    db.run(insertPersonalSql, [user.id, user.fecha_nacimiento, user.direccion]);
                    db.run(insertSaludSql, [user.id, user.alergias, user.grupo_sanguineo]);
                    db.run(insertContactSql, [user.id, user.telefono, user.emergencia_contacto]);
                    inserted++;
                }

                if (index === defaultUsers.length - 1) {
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error al hacer commit:', err.message);
                            return res.status(500).send('Error al insertar datos por defecto.');
                        }

                        res.send(`Datos por defecto procesados. Se insertaron ${inserted} usuario(s).`);
                    });
                }
            });
        });
    });
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
