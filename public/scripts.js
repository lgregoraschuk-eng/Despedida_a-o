// Variables de estado
var estadoApp = {
  nombre: '',
  asistencia: null,
  tieneRestriccion: 'NO',
  detalleRestriccion: '',
  enviando: false
};

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  aplicarConfiguracion();
  ocultarBannerError();
  alternarEstadoCarga(false);
  mostrarFormulario();
  iniciarParticulas();
  iniciarEventosFormulario();
  actualizarEnlaceWhatsAppDirecto();
});

// Configuración
function obtenerConfig() {
  if (typeof CONFIG !== 'undefined') {
    return CONFIG;
  }
  if (window.APP_CONFIG) {
    return window.APP_CONFIG;
  }
  return {
    EMPRESA: 'LP Pietroboni',
    NOMBRE_EVENTO: 'Despedida de Año',
    ANIO_EVENTO: '2026',
    FECHA_EVENTO: 'Viernes 11 de Diciembre',
    FECHA_LIMITE: 'Viernes 04/12',
    HORARIO_EVENTO: '20:00 hs',
    LUGAR_EVENTO: 'Salón Sosiego',
    UBICACION_MAPS_URL: 'https://maps.app.goo.gl/Wj3KGgGST2dAqve68',
    WHATSAPP_NUMERO: '5493442654321',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzMEK3NgsSS3i2_GPbfy4QsRI1H5fqttNlzJXC8kmq7xpqAH8B5-SV9ycDsDI1vosVb/exec'
  };
}

function aplicarConfiguracion() {
  var cfg = obtenerConfig();
  var empresa = cfg.EMPRESA || cfg.empresa || 'LP Pietroboni';
  var evento = cfg.NOMBRE_EVENTO || cfg.nombreEvento || 'Despedida de Año';
  var anio = cfg.ANIO_EVENTO || cfg.anioEvento || '2026';
  var fecha = cfg.FECHA_EVENTO || cfg.fechaEvento || 'Viernes 11 de Diciembre';
  var limite = cfg.FECHA_LIMITE || cfg.fechaLimite || 'Viernes 04/12';
  var horario = cfg.HORARIO_EVENTO || cfg.horarioEvento || '20:00 hs';
  var lugar = cfg.LUGAR_EVENTO || cfg.lugarEvento || 'Salón Sosiego';
  var mapsUrl = cfg.UBICACION_MAPS_URL || cfg.ubicacionMapsUrl || 'https://maps.app.goo.gl/Wj3KGgGST2dAqve68';

  document.title = evento + ' | ' + empresa;

  var elsEmpresa = document.querySelectorAll('.bind-empresa');
  for (var i = 0; i < elsEmpresa.length; i++) {
    elsEmpresa[i].textContent = empresa;
  }

  var elsFecha = document.querySelectorAll('.bind-fecha');
  for (var j = 0; j < elsFecha.length; j++) {
    elsFecha[j].textContent = fecha;
  }

  var elsLimite = document.querySelectorAll('.bind-fecha-limite');
  for (var k = 0; k < elsLimite.length; k++) {
    elsLimite[k].textContent = limite;
  }

  var elsHorario = document.querySelectorAll('.bind-horario');
  for (var m = 0; m < elsHorario.length; m++) {
    elsHorario[m].textContent = horario;
  }

  var elsLugar = document.querySelectorAll('.bind-lugar');
  for (var n = 0; n < elsLugar.length; n++) {
    elsLugar[n].textContent = lugar;
  }

  var elsMaps = document.querySelectorAll('.bind-maps');
  for (var p = 0; p < elsMaps.length; p++) {
    elsMaps[p].href = mapsUrl;
  }

  var elsAnio = document.querySelectorAll('.bind-anio');
  for (var q = 0; q < elsAnio.length; q++) {
    elsAnio[q].textContent = anio;
  }
}

// Interfaz de usuario
function mostrarFormulario() {
  var formContainer = document.getElementById('form-container');
  var successYes = document.getElementById('success-yes-view');
  var successNo = document.getElementById('success-no-view');

  if (successYes) {
    successYes.hidden = true;
    successYes.style.display = 'none';
  }
  if (successNo) {
    successNo.hidden = true;
    successNo.style.display = 'none';
  }
  if (formContainer) {
    formContainer.hidden = false;
    formContainer.style.display = 'block';
  }

  var radioSi = document.getElementById('asistencia-si');
  alternarVisibilidadRestriccion(radioSi && radioSi.checked);
  actualizarEstilosRadios();
  ocultarBannerError();
}

function alternarVisibilidadRestriccion(asiste) {
  var dietaryContainer = document.getElementById('dietary-container');
  var dietaryDetailBox = document.getElementById('dietary-detail-box');
  var radioNo = document.getElementById('restriccion-no');
  var radioSi = document.getElementById('restriccion-si');
  var detalleInput = document.getElementById('restriccion-detalle-input');

  if (asiste) {
    if (dietaryContainer) {
      dietaryContainer.hidden = false;
      dietaryContainer.style.display = 'flex';
    }
    if (radioSi && radioSi.checked) {
      if (dietaryDetailBox) {
        dietaryDetailBox.hidden = false;
        dietaryDetailBox.style.display = 'flex';
      }
    }
  } else {
    if (dietaryContainer) {
      dietaryContainer.hidden = true;
      dietaryContainer.style.display = 'none';
    }
    if (dietaryDetailBox) {
      dietaryDetailBox.hidden = true;
      dietaryDetailBox.style.display = 'none';
    }
    if (radioNo) radioNo.checked = true;
    if (radioSi) radioSi.checked = false;
    if (detalleInput) detalleInput.value = '';
    limpiarErrorCampo('dietary-detalle');
    actualizarEstilosRadios();
  }
}

function mostrarVistaResultado(vistaId) {
  var formContainer = document.getElementById('form-container');
  var successYes = document.getElementById('success-yes-view');
  var successNo = document.getElementById('success-no-view');

  if (formContainer) {
    formContainer.hidden = true;
    formContainer.style.display = 'none';
  }
  if (successYes) {
    successYes.hidden = true;
    successYes.style.display = 'none';
  }
  if (successNo) {
    successNo.hidden = true;
    successNo.style.display = 'none';
  }

  var vista = document.getElementById(vistaId);
  if (vista) {
    vista.hidden = false;
    vista.style.display = 'flex';
  }
  ocultarBannerError();
}

function mostrarBannerError(mensaje, permitirWhatsAppFallback) {
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim() === '') {
    return;
  }
  var banner = document.getElementById('status-banner');
  var texto = document.getElementById('status-banner-text');
  var fallbackBox = document.getElementById('banner-whatsapp-fallback');
  var fallbackLink = document.getElementById('banner-whatsapp-link');

  if (banner && texto) {
    texto.textContent = mensaje.trim();
    banner.hidden = false;
    banner.style.display = 'flex';

    if (permitirWhatsAppFallback && fallbackBox && fallbackLink) {
      fallbackBox.hidden = false;
      var cfg = obtenerConfig();
      var numero = cfg.WHATSAPP_NUMERO || cfg.whatsappNumero || '5493442654321';
      var textoMensaje = armarMensajeWhatsApp(
        estadoApp.nombre,
        estadoApp.asistencia,
        estadoApp.tieneRestriccion,
        estadoApp.detalleRestriccion
      );
      fallbackLink.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(textoMensaje);
    } else if (fallbackBox) {
      fallbackBox.hidden = true;
    }

    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function ocultarBannerError() {
  var banner = document.getElementById('status-banner');
  var texto = document.getElementById('status-banner-text');
  var fallbackBox = document.getElementById('banner-whatsapp-fallback');
  if (banner) {
    banner.hidden = true;
    banner.style.display = 'none';
  }
  if (texto) {
    texto.textContent = '';
  }
  if (fallbackBox) {
    fallbackBox.hidden = true;
  }
}

// Generador de mensajes de WhatsApp
function armarMensajeWhatsApp(nombre, asistencia, tieneRestriccion, detalleRestriccion) {
  var cfg = obtenerConfig();
  var empresa = cfg.EMPRESA || cfg.empresa || 'LP Pietroboni';
  var nombreInvitado = nombre && nombre.trim() ? nombre.trim() : 'Invitado/a';
  var texto = 'Hola! Te escribo por la Despedida de Año de ' + empresa + '.\n\n';
  texto += 'Nombre: ' + nombreInvitado + '\n';
  if (asistencia === 'SI') {
    texto += 'Asistencia: ¡Sí, ahí estaré!\n';
    if (tieneRestriccion === 'SI' && detalleRestriccion) {
      texto += 'Menú especial / Restricción: ' + detalleRestriccion + '\n';
    } else {
      texto += 'Menú especial: Sin restricciones\n';
    }
  } else if (asistencia === 'NO') {
    texto += 'Asistencia: No podré asistir\n';
  } else {
    texto += 'Quiero confirmar mi asistencia al evento.\n';
  }
  return texto;
}

function actualizarEnlaceWhatsAppDirecto() {
  var btn = document.getElementById('direct-whatsapp-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var cfg = obtenerConfig();
    var numero = cfg.WHATSAPP_NUMERO || cfg.whatsappNumero || '5493442654321';
    var nombreInput = document.getElementById('nombre-input');
    var nombre = nombreInput ? nombreInput.value.trim() : '';

    var radioSi = document.getElementById('asistencia-si');
    var radioNo = document.getElementById('asistencia-no');
    var asistencia = null;
    if (radioSi && radioSi.checked) asistencia = 'SI';
    if (radioNo && radioNo.checked) asistencia = 'NO';

    var tieneRestriccion = 'NO';
    var detalleRestriccion = '';
    var restSi = document.getElementById('restriccion-si');
    if (asistencia === 'SI' && restSi && restSi.checked) {
      tieneRestriccion = 'SI';
      var detalleInput = document.getElementById('restriccion-detalle-input');
      detalleRestriccion = detalleInput ? detalleInput.value.trim() : '';
    }

    var mensaje = armarMensajeWhatsApp(nombre, asistencia, tieneRestriccion, detalleRestriccion);
    btn.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
  });
}

function actualizarEstilosRadios() {
  var radioSi = document.getElementById('asistencia-si');
  var radioNo = document.getElementById('asistencia-no');
  var labelSi = document.getElementById('label-asistencia-si');
  var labelNo = document.getElementById('label-asistencia-no');

  if (labelSi && radioSi) {
    if (radioSi.checked) {
      labelSi.classList.add('selected');
    } else {
      labelSi.classList.remove('selected');
    }
  }

  if (labelNo && radioNo) {
    if (radioNo.checked) {
      labelNo.classList.add('selected');
    } else {
      labelNo.classList.remove('selected');
    }
  }

  var restNo = document.getElementById('restriccion-no');
  var restSi = document.getElementById('restriccion-si');
  var labelRestNo = document.getElementById('label-restriccion-no');
  var labelRestSi = document.getElementById('label-restriccion-si');

  if (labelRestNo && restNo) {
    if (restNo.checked) {
      labelRestNo.classList.add('selected');
    } else {
      labelRestNo.classList.remove('selected');
    }
  }

  if (labelRestSi && restSi) {
    if (restSi.checked) {
      labelRestSi.classList.add('selected');
    } else {
      labelRestSi.classList.remove('selected');
    }
  }
}

// Eventos de formulario
function iniciarEventosFormulario() {
  var form = document.getElementById('rsvp-form');
  var nombreInput = document.getElementById('nombre-input');
  var radioSi = document.getElementById('asistencia-si');
  var radioNo = document.getElementById('asistencia-no');
  var btnEditarSi = document.getElementById('btn-editar-si');
  var btnEditarNo = document.getElementById('btn-editar-no');

  var restNo = document.getElementById('restriccion-no');
  var restSi = document.getElementById('restriccion-si');
  var dietaryDetailBox = document.getElementById('dietary-detail-box');
  var detalleInput = document.getElementById('restriccion-detalle-input');

  if (radioSi) {
    radioSi.addEventListener('change', function () {
      actualizarEstilosRadios();
      limpiarErrorCampo('asistencia');
      alternarVisibilidadRestriccion(true);
    });
  }

  if (radioNo) {
    radioNo.addEventListener('change', function () {
      actualizarEstilosRadios();
      limpiarErrorCampo('asistencia');
      alternarVisibilidadRestriccion(false);
    });
  }

  if (restNo) {
    restNo.addEventListener('change', function () {
      actualizarEstilosRadios();
      if (dietaryDetailBox) {
        dietaryDetailBox.hidden = true;
        dietaryDetailBox.style.display = 'none';
      }
      if (detalleInput) detalleInput.value = '';
      limpiarErrorCampo('dietary-detalle');
    });
  }

  if (restSi) {
    restSi.addEventListener('change', function () {
      actualizarEstilosRadios();
      if (dietaryDetailBox) {
        dietaryDetailBox.hidden = false;
        dietaryDetailBox.style.display = 'flex';
      }
      if (detalleInput) {
        detalleInput.focus();
      }
    });
  }

  if (detalleInput) {
    detalleInput.addEventListener('input', function () {
      limpiarErrorCampo('dietary-detalle');
    });
  }

  if (nombreInput) {
    nombreInput.addEventListener('input', function () {
      limpiarErrorCampo('nombre');
    });
  }

  if (btnEditarSi) {
    btnEditarSi.addEventListener('click', mostrarFormulario);
  }

  if (btnEditarNo) {
    btnEditarNo.addEventListener('click', mostrarFormulario);
  }

  if (form) {
    form.addEventListener('submit', procesarEnvioFormulario);
  }
}

function limpiarErrorCampo(campo) {
  if (campo === 'nombre') {
    var input = document.getElementById('nombre-input');
    var error = document.getElementById('nombre-error');
    if (input) input.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  } else if (campo === 'asistencia') {
    var errorAsistencia = document.getElementById('asistencia-error');
    if (errorAsistencia) errorAsistencia.textContent = '';
  } else if (campo === 'dietary-detalle') {
    var inputDetalle = document.getElementById('restriccion-detalle-input');
    var errorDetalle = document.getElementById('restriccion-detalle-error');
    if (inputDetalle) inputDetalle.removeAttribute('aria-invalid');
    if (errorDetalle) errorDetalle.textContent = '';
  }
}

// Validaciones
function validarFormulario(nombre, asistencia, tieneRestriccion, detalleRestriccion) {
  var esValido = true;

  var nombreInput = document.getElementById('nombre-input');
  var nombreError = document.getElementById('nombre-error');
  if (!nombre || nombre.length < 2) {
    if (nombreInput) nombreInput.setAttribute('aria-invalid', 'true');
    if (nombreError) nombreError.textContent = 'Por favor, ingresá tu nombre completo.';
    esValido = false;
  } else {
    if (nombreInput) nombreInput.removeAttribute('aria-invalid');
    if (nombreError) nombreError.textContent = '';
  }

  var asistenciaError = document.getElementById('asistencia-error');
  if (!asistencia) {
    if (asistenciaError) asistenciaError.textContent = 'Por favor, seleccioná una de las dos opciones.';
    esValido = false;
  } else {
    if (asistenciaError) asistenciaError.textContent = '';
  }

  if (asistencia === 'SI' && tieneRestriccion === 'SI') {
    var inputDetalle = document.getElementById('restriccion-detalle-input');
    var errorDetalle = document.getElementById('restriccion-detalle-error');
    if (!detalleRestriccion || detalleRestriccion.length < 2) {
      if (inputDetalle) inputDetalle.setAttribute('aria-invalid', 'true');
      if (errorDetalle) errorDetalle.textContent = 'Por favor, especificá tu restricción alimentaria o menú requerido.';
      esValido = false;
    } else {
      if (inputDetalle) inputDetalle.removeAttribute('aria-invalid');
      if (errorDetalle) errorDetalle.textContent = '';
    }
  }

  return esValido;
}

// Procesamiento de datos
function procesarEnvioFormulario(evento) {
  evento.preventDefault();

  if (estadoApp.enviando) {
    return;
  }

  var nombreInput = document.getElementById('nombre-input');
  var nombre = nombreInput ? nombreInput.value.trim() : '';

  var radioSi = document.getElementById('asistencia-si');
  var radioNo = document.getElementById('asistencia-no');
  var asistencia = null;
  if (radioSi && radioSi.checked) asistencia = 'SI';
  if (radioNo && radioNo.checked) asistencia = 'NO';

  var tieneRestriccion = 'NO';
  var detalleRestriccion = '';

  if (asistencia === 'SI') {
    var restSi = document.getElementById('restriccion-si');
    if (restSi && restSi.checked) {
      tieneRestriccion = 'SI';
      var detalleInput = document.getElementById('restriccion-detalle-input');
      detalleRestriccion = detalleInput ? detalleInput.value.trim() : '';
    }
  }

  // Validaciones
  if (!validarFormulario(nombre, asistencia, tieneRestriccion, detalleRestriccion)) {
    return;
  }

  alternarEstadoCarga(true);
  ocultarBannerError();

  var payload = {
    nombre: nombre,
    asistencia: asistencia,
    tieneRestriccion: tieneRestriccion,
    detalleRestriccion: detalleRestriccion
  };

  // Consultas a base de datos
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler(alCompletarConfirmacion)
      .withFailureHandler(alFallarConfirmacion)
      .guardarConfirmacion(payload);
    return;
  }

  // Despliegue en Vercel
  enviarViaVercel(payload);
}

async function enviarViaVercel(payload) {
  var enviadoConExito = false;
  var cfg = obtenerConfig();

  try {
    var response = await fetch('/api/confirmar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      var data = await response.json();
      if (data && data.success) {
        enviadoConExito = true;
        alCompletarConfirmacion(data);
        return;
      }
    }
  } catch (e) {
    // Intento con webhook directo de Apps Script como contingencia
  }

  var appsScriptUrl = cfg.APPS_SCRIPT_URL || cfg.appsScriptUrl;
  if (!enviadoConExito && appsScriptUrl) {
    try {
      await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      enviadoConExito = true;
      alCompletarConfirmacion({
        success: true,
        nombre: payload.nombre,
        asistencia: payload.asistencia,
        tieneRestriccion: payload.tieneRestriccion,
        detalleRestriccion: payload.detalleRestriccion
      });
      return;
    } catch (errPost) {
      // Error de contingencia
    }
  }

  alFallarConfirmacion(new Error('Fallo de conexión'));
}

function alternarEstadoCarga(cargando) {
  estadoApp.enviando = cargando;
  var btn = document.getElementById('submit-btn');
  var label = document.getElementById('btn-label');
  var loader = document.getElementById('btn-loader');

  if (btn) btn.disabled = cargando;
  if (label) {
    label.hidden = cargando;
    label.style.display = cargando ? 'none' : 'inline';
  }
  if (loader) {
    loader.hidden = !cargando;
    loader.style.display = cargando ? 'flex' : 'none';
  }
}

// Respuesta
function alCompletarConfirmacion(respuesta) {
  alternarEstadoCarga(false);

  if (!respuesta || !respuesta.success) {
    mostrarBannerError(respuesta && respuesta.message ? respuesta.message : 'No pudimos registrar tu respuesta. Por favor, intentá nuevamente.', true);
    return;
  }

  estadoApp.nombre = respuesta.nombre || '';
  estadoApp.asistencia = respuesta.asistencia || '';
  estadoApp.tieneRestriccion = respuesta.tieneRestriccion || 'NO';
  estadoApp.detalleRestriccion = respuesta.detalleRestriccion || '';

  var whatsappBtn = document.getElementById('success-whatsapp-btn');
  if (whatsappBtn) {
    var cfg = obtenerConfig();
    var numero = cfg.WHATSAPP_NUMERO || cfg.whatsappNumero || '5493442654321';
    var mensaje = armarMensajeWhatsApp(
      estadoApp.nombre,
      estadoApp.asistencia,
      estadoApp.tieneRestriccion,
      estadoApp.detalleRestriccion
    );
    whatsappBtn.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
  }

  if (respuesta.asistencia === 'SI') {
    mostrarVistaResultado('success-yes-view');
  } else {
    mostrarVistaResultado('success-no-view');
  }
}

// Gestión de errores
function alFallarConfirmacion(error) {
  alternarEstadoCarga(false);
  mostrarBannerError('No pudimos conectar con el servidor para registrar tu confirmación en la planilla. Podés enviarla directamente por WhatsApp con un solo clic:', true);
}

// Fondo y efectos
function iniciarParticulas() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var ctx = canvas.getContext('2d');
  var particulas = [];
  var totalParticulas = window.innerWidth < 600 ? 25 : 45;

  function ajustarTamano() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  ajustarTamano();
  window.addEventListener('resize', ajustarTamano);

  for (var i = 0; i < totalParticulas; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radio: Math.random() * 1.8 + 0.6,
      opacidad: Math.random() * 0.45 + 0.15,
      velocidadY: Math.random() * 0.35 + 0.1,
      oscilacion: Math.random() * 0.02
    });
  }

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var j = 0; j < particulas.length; j++) {
      var p = particulas[j];
      p.y -= p.velocidadY;
      p.x += Math.sin(p.y * p.oscilacion) * 0.3;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214, 184, 117, ' + p.opacidad + ')';
      ctx.fill();
    }

    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}

