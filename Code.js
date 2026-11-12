// Controladores
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.config = obtenerConfiguracionEvento();

  return template.evaluate()
    .setTitle(CONFIG.NOMBRE_EVENTO + ' | ' + CONFIG.EMPRESA)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  // Procesamiento de datos
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var datos = JSON.parse(contents);
    var resultado = guardarConfirmacion(datos);

    // Respuesta
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Gestión de errores
    Logger.log('Error en doPost: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        code: 'POST_ERROR',
        message: 'Error al procesar la solicitud: ' + err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utilidades
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function sanitizarTexto(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }
  return texto
    .replace(/[<>]/g, '')
    .trim();
}

// Inicialización
function obtenerSpreadsheetId() {
  var idGuardado = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (idGuardado && idGuardado.trim() !== '') {
    return idGuardado.trim();
  }
  return CONFIG.SPREADSHEET_ID ? CONFIG.SPREADSHEET_ID.trim() : '';
}

function crearPlanillaBaseDatos() {
  // Consultas a base de datos
  var nombreLibro = CONFIG.NOMBRE_EVENTO + ' - ' + CONFIG.EMPRESA;
  var ss = SpreadsheetApp.create(nombreLibro);
  var sheet = ss.getActiveSheet();
  sheet.setName(CONFIG.SHEET_NAME);

  // Procesamiento de datos
  var headers = ['TIMESTAMP', 'NOMBRE', 'ASISTENCIA', 'RESTRICCION_ALIMENTARIA', 'DETALLE_RESTRICCION', 'EMAIL'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#101B32');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // Configuración
  var ssId = ss.getId();
  var ssUrl = ss.getUrl();

  try {
    DriveApp.getFileById(ssId).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  } catch (e) {
    // Gestión de errores
  }

  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ssId);

  Logger.log('Planilla creada exitosamente: ' + ssUrl);
  Logger.log('ID para CONFIG.SPREADSHEET_ID: ' + ssId);

  // Respuesta
  return {
    success: true,
    id: ssId,
    url: ssUrl
  };
}

function inicializarSistema() {
  // Consultas a base de datos
  var ssId = obtenerSpreadsheetId();
  if (!ssId) {
    return crearPlanillaBaseDatos();
  }

  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Validaciones
  var headers = ['TIMESTAMP', 'NOMBRE', 'ASISTENCIA', 'RESTRICCION_ALIMENTARIA', 'DETALLE_RESTRICCION', 'EMAIL'];
  var currentHeaders = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, headers.length).getValues()[0] : [];

  var headersCoinciden = currentHeaders.length === headers.length &&
    headers.every(function(val, index) { return val === currentHeaders[index]; });

  // Procesamiento de datos
  if (!headersCoinciden) {
    return actualizarHojaExistente();
  }

  // Respuesta
  return { success: true, id: ssId, url: ss.getUrl() };
}

function actualizarHojaExistente() {
  // Consultas a base de datos
  var ssId = obtenerSpreadsheetId();
  if (!ssId) {
    Logger.log('Error: No se encontró SPREADSHEET_ID configurado.');
    return { success: false, message: 'No hay SPREADSHEET_ID configurado.' };
  }

  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log('La hoja ' + CONFIG.SHEET_NAME + ' no existe. Creando hoja...');
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Validaciones
  var targetHeaders = ['TIMESTAMP', 'NOMBRE', 'ASISTENCIA', 'RESTRICCION_ALIMENTARIA', 'DETALLE_RESTRICCION', 'EMAIL'];
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  // Procesamiento de datos
  if (lastRow === 0 || lastCol === 0) {
    sheet.getRange(1, 1, 1, targetHeaders.length).setValues([targetHeaders]);
  } else {
    var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var tieneRestriccion = currentHeaders.indexOf('RESTRICCION_ALIMENTARIA') !== -1;
    var tieneDetalle = currentHeaders.indexOf('DETALLE_RESTRICCION') !== -1;

    if (!tieneRestriccion || !tieneDetalle) {
      var idxEmail = currentHeaders.indexOf('EMAIL');
      if (idxEmail !== -1) {
        sheet.insertColumnsBefore(idxEmail + 1, 2);
      } else {
        sheet.insertColumnsAfter(lastCol, 2);
      }

      sheet.getRange(1, 1, 1, targetHeaders.length).setValues([targetHeaders]);

      if (lastRow > 1) {
        var numFilas = lastRow - 1;
        var valoresDefault = [];
        for (var i = 0; i < numFilas; i++) {
          valoresDefault.push(['NO', '-']);
        }
        sheet.getRange(2, 4, numFilas, 2).setValues(valoresDefault);
      }
    }
  }

  // Configuración
  var headerRange = sheet.getRange(1, 1, 1, targetHeaders.length);
  headerRange.setBackground('#101B32');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, targetHeaders.length);

  Logger.log('Hoja actualizada exitosamente con las columnas RESTRICCION_ALIMENTARIA y DETALLE_RESTRICCION.');

  // Respuesta
  return {
    success: true,
    message: 'Hoja actualizada correctamente con las columnas de restricción alimentaria.'
  };
}

// Procesamiento de datos
function guardarConfirmacion(datos) {
  // Validaciones
  if (!datos || typeof datos !== 'object') {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Datos de formulario inválidos.'
    };
  }

  var nombre = sanitizarTexto(datos.nombre);
  if (!nombre || nombre.length < 2 || nombre.length > 120) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Por favor, ingresá tu nombre y apellido completo.'
    };
  }

  var asistencia = datos.asistencia === 'SI' ? 'SI' : (datos.asistencia === 'NO' ? 'NO' : '');
  if (!asistencia) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Por favor, seleccioná si asistirás o no.'
    };
  }

  var nombreNormalizado = nombre.toLowerCase().trim();

  // Bloqueo de concurrencia
  var lock = LockService.getScriptLock();
  var adquirido = false;
  try {
    adquirido = lock.tryLock(20000);
    if (!adquirido) {
      return {
        success: false,
        code: 'LOCK_TIMEOUT',
        message: 'El servidor se encuentra procesando solicitudes. Por favor, reintentá en un instante.'
      };
    }

    var tieneRestriccion = 'NO';
    var detalleRestriccion = '-';

    if (asistencia === 'SI') {
      if (datos.tieneRestriccion === 'SI') {
        tieneRestriccion = 'SI';
        var detalle = sanitizarTexto(datos.detalleRestriccion);
        detalleRestriccion = detalle ? detalle.substring(0, 150) : 'No especificado';
      } else {
        tieneRestriccion = 'NO';
        detalleRestriccion = '-';
      }
    } else {
      tieneRestriccion = 'NO';
      detalleRestriccion = '-';
    }

    // Consultas a base de datos
    var ssId = obtenerSpreadsheetId();
    if (!ssId) {
      return {
        success: false,
        code: 'NOT_CONFIGURED',
        message: 'La planilla de confirmaciones aún no ha sido generada. Por favor, ejecutá la función crearPlanillaBaseDatos en el editor de Apps Script.'
      };
    }

    var ss = SpreadsheetApp.openById(ssId);
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      inicializarSistema();
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    }

    if (sheet.getLastColumn() < 5) {
      actualizarHojaExistente();
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    }

    var lastRow = sheet.getLastRow();
    var filaExistente = -1;

    if (lastRow > 1) {
      var nombresCol = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < nombresCol.length; i++) {
        var nombreRegistrado = nombresCol[i][0] ? nombresCol[i][0].toString().toLowerCase().trim() : '';
        if (nombreRegistrado === nombreNormalizado) {
          filaExistente = i + 2;
          break;
        }
      }
    }

    var timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

    // Procesamiento de datos
    if (filaExistente > 0) {
      sheet.getRange(filaExistente, 1, 1, 5).setValues([[timestamp, nombre, asistencia, tieneRestriccion, detalleRestriccion]]);
    } else {
      sheet.appendRow([timestamp, nombre, asistencia, tieneRestriccion, detalleRestriccion, '']);
    }

    // Respuesta
    return {
      success: true,
      asistencia: asistencia,
      nombre: nombre,
      tieneRestriccion: tieneRestriccion,
      detalleRestriccion: detalleRestriccion
    };
  } catch (err) {
    // Gestión de errores
    Logger.log('Error en guardarConfirmacion: ' + err.toString());
    return {
      success: false,
      code: 'SERVER_ERROR',
      message: 'No pudimos registrar tu respuesta. Por favor, intentá nuevamente.'
    };
  } finally {
    if (adquirido) {
      try {
        lock.releaseLock();
      } catch (e) {
        // Gestión de errores
      }
    }
  }
}
