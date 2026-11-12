// Controladores
export default async function handler(req, res) {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido. Solo se acepta POST.'
    });
  }

  // Validaciones
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Cuerpo de solicitud inválido.'
    });
  }

  // URL del Webhook en Google Apps Script
  const appsScriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzMEK3NgsSS3i2_GPbfy4QsRI1H5fqttNlzJXC8kmq7xpqAH8B5-SV9ycDsDI1vosVb/exec';

  try {
    // Procesamiento de datos
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    // Gestión de errores
    console.error('Error al reenviar confirmación a Google Sheets:', error);
    return res.status(500).json({
      success: false,
      message: 'Error de comunicación con Google Sheets.',
      error: error.message
    });
  }
}

