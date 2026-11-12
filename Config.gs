// Configuración
var CONFIG = {
  EMPRESA: 'LP Pietroboni',
  NOMBRE_EVENTO: 'Despedida de Año',
  ANIO_EVENTO: '2026',
  FECHA_EVENTO: 'Viernes 11 de Diciembre',
  FECHA_LIMITE: 'Viernes 04/12',
  HORARIO_EVENTO: '20:00 hs',
  LUGAR_EVENTO: 'Salón Sosiego',
  UBICACION_MAPS_URL: 'https://maps.app.goo.gl/Wj3KGgGST2dAqve68',
  WHATSAPP_NUMERO: '5493442654321',
  SPREADSHEET_ID: '1lRw17OIJa8EdDGlL9vU5TN2vg44qKyIa2XLJrmUP79Y',
  SHEET_NAME: 'CONFIRMACIONES',
  TIMEZONE: 'America/Argentina/Buenos_Aires',
  LOGO_DRIVE_FILE_ID: '1e2fcpzWraTrnuwWGLl_lu2JiAWS7aUQ-'
};

// Utilidades
function extraerDriveId(valor) {
  if (!valor || typeof valor !== 'string') return '';
  var texto = valor.trim();
  var matchUrl = texto.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchUrl && matchUrl[1]) {
    return matchUrl[1];
  }
  var matchParam = texto.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchParam && matchParam[1]) {
    return matchParam[1];
  }
  return texto;
}

// Configuración pública
function obtenerConfiguracionEvento() {
  var fileId = extraerDriveId(CONFIG.LOGO_DRIVE_FILE_ID) || '1e2fcpzWraTrnuwWGLl_lu2JiAWS7aUQ-';
  var logoUrl = '';

  // Procesamiento de datos
  try {
    var archivo = DriveApp.getFileById(fileId);
    var blob = archivo.getBlob();
    var mime = blob.getContentType();
    var base64 = Utilities.base64Encode(blob.getBytes());
    logoUrl = 'data:' + mime + ';base64,' + base64;
  } catch (error) {
    // Gestión de errores
    Logger.log('Aviso DriveApp al leer logo: ' + error.toString());
    logoUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w500';
  }

  // Respuesta
  return {
    empresa: CONFIG.EMPRESA,
    nombreEvento: CONFIG.NOMBRE_EVENTO,
    anioEvento: CONFIG.ANIO_EVENTO,
    fechaEvento: CONFIG.FECHA_EVENTO,
    fechaLimite: CONFIG.FECHA_LIMITE,
    horarioEvento: CONFIG.HORARIO_EVENTO,
    lugarEvento: CONFIG.LUGAR_EVENTO,
    ubicacionMapsUrl: CONFIG.UBICACION_MAPS_URL,
    whatsappNumero: CONFIG.WHATSAPP_NUMERO,
    logoUrl: logoUrl
  };
}

