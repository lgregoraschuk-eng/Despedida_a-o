// Variables de estado
var estadoApp = {
  nombre: '',
  asistencia: 'SI',
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
});

// Configuración
function obtenerConfig() {
  if (typeof CONFIG !== 'undefined') {
    return CONFIG;
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
    SHEETDB_URL: 'https://sheetdb.io/api/v1/w500zvegdxazp'
  };
}

function aplicarConfiguracion() {
  var cfg = obtenerConfig();
  var empresa = cfg.EMPRESA || 'LP Pietroboni';
  var evento = cfg.NOMBRE_EVENTO || 'Despedida de Año';
  var anio = cfg.ANIO_EVENTO || '2026';
  var fecha = cfg.FECHA_EVENTO || 'Viernes 11 de Diciembre';
  var limite = cfg.FECHA_LIMITE || 'Viernes 04/12';
  var horario = cfg.HORARIO_EVENTO || '20:00 hs';
  var lugar = cfg.LUGAR_EVENTO || 'Salón Sosiego';
  var mapsUrl = cfg.UBICACION_MAPS_URL || 'https://maps.app.goo.gl/Wj3KGgGST2dAqve68';

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

  if (successYes) {
    successYes.hidden = true;
    successYes.style.display = 'none';
  }
  if (formContainer) {
    formContainer.hidden = false;
    formContainer.style.display = 'block';
  }

  var nombreInput = document.getElementById('nombre-input');
  if (nombreInput) {
    nombreInput.value = '';
    nombreInput.removeAttribute('aria-invalid');
  }

  var radioNo = document.getElementById('restriccion-no');
  var radioSi = document.getElementById('restriccion-si');
  var detalleInput = document.getElementById('restriccion-detalle-input');
  var dietaryDetailBox = document.getElementById('dietary-detail-box');

  if (radioNo) radioNo.checked = true;
  if (radioSi) radioSi.checked = false;
  if (dietaryDetailBox) {
    dietaryDetailBox.hidden = true;
    dietaryDetailBox.style.display = 'none';
  }
  if (detalleInput) {
    detalleInput.value = '';
    detalleInput.removeAttribute('aria-invalid');
  }

  actualizarEstilosRadios();
  ocultarBannerError();
}

function mostrarVistaResultado(vistaId) {
  var formContainer = document.getElementById('form-container');
  var successYes = document.getElementById('success-yes-view');

  if (formContainer) {
    formContainer.hidden = true;
    formContainer.style.display = 'none';
  }
  if (successYes) {
    successYes.hidden = true;
    successYes.style.display = 'none';
  }

  var vista = document.getElementById(vistaId);
  if (vista) {
    vista.hidden = false;
    vista.style.display = 'flex';
    vista.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  ocultarBannerError();
}

function mostrarBannerError(mensaje) {
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim() === '') {
    return;
  }
  var banner = document.getElementById('status-banner');
  var texto = document.getElementById('status-banner-text');

  if (banner && texto) {
    texto.textContent = mensaje.trim();
    banner.hidden = false;
    banner.style.display = 'flex';
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function ocultarBannerError() {
  var banner = document.getElementById('status-banner');
  var texto = document.getElementById('status-banner-text');
  if (banner) {
    banner.hidden = true;
    banner.style.display = 'none';
  }
  if (texto) {
    texto.textContent = '';
  }
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

function actualizarEstilosRadios() {
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
  var btnEditarSi = document.getElementById('btn-editar-si');

  var restNo = document.getElementById('restriccion-no');
  var restSi = document.getElementById('restriccion-si');
  var dietaryDetailBox = document.getElementById('dietary-detail-box');
  var detalleInput = document.getElementById('restriccion-detalle-input');

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
  } else if (campo === 'dietary-detalle') {
    var inputDetalle = document.getElementById('restriccion-detalle-input');
    var errorDetalle = document.getElementById('restriccion-detalle-error');
    if (inputDetalle) inputDetalle.removeAttribute('aria-invalid');
    if (errorDetalle) errorDetalle.textContent = '';
  }
}

// Validaciones
function validarFormulario(nombre, tieneRestriccion, detalleRestriccion) {
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

  if (tieneRestriccion === 'SI') {
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
async function procesarEnvioFormulario(evento) {
  evento.preventDefault();

  if (estadoApp.enviando) {
    return;
  }

  var nombreInput = document.getElementById('nombre-input');
  var nombre = nombreInput ? nombreInput.value.trim() : '';

  var tieneRestriccion = 'NO';
  var detalleRestriccion = '-';

  var restSi = document.getElementById('restriccion-si');
  if (restSi && restSi.checked) {
    tieneRestriccion = 'SI';
    var detalleInput = document.getElementById('restriccion-detalle-input');
    detalleRestriccion = detalleInput && detalleInput.value.trim() ? detalleInput.value.trim() : 'No especificado';
  }

  // Validaciones
  if (!validarFormulario(nombre, tieneRestriccion, detalleRestriccion)) {
    return;
  }

  alternarEstadoCarga(true);
  ocultarBannerError();

  var ahora = new Date();
  var pad = function (n) { return n < 10 ? '0' + n : n; };
  var timestamp = ahora.getFullYear() + '-' +
    pad(ahora.getMonth() + 1) + '-' +
    pad(ahora.getDate()) + ' ' +
    pad(ahora.getHours()) + ':' +
    pad(ahora.getMinutes()) + ':' +
    pad(ahora.getSeconds());

  var payload = {
    TIMESTAMP: timestamp,
    NOMBRE: nombre,
    ASISTENCIA: 'SI',
    RESTRICCION_ALIMENTARIA: tieneRestriccion,
    DETALLE_RESTRICCION: detalleRestriccion
  };

  var cfg = obtenerConfig();
  var endpoint = cfg.SHEETDB_URL || 'https://sheetdb.io/api/v1/w500zvegdxazp';

  // Consultas a base de datos
  try {
    var respuesta = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [payload]
      })
    });

    if (respuesta.ok) {
      alternarEstadoCarga(false);
      alCompletarConfirmacion({
        nombre: nombre,
        asistencia: 'SI',
        tieneRestriccion: tieneRestriccion,
        detalleRestriccion: detalleRestriccion
      });
    } else {
      var errData = await respuesta.json().catch(function () { return {}; });
      throw new Error(errData.error || 'Error HTTP ' + respuesta.status);
    }
  } catch (err) {
    // Gestión de errores
    alternarEstadoCarga(false);
    console.error('Error al registrar confirmación en SheetDB:', err);
    mostrarBannerError('No pudimos conectar con la planilla para registrar tu confirmación. Por favor, verificá tu conexión e intentá nuevamente.');
  }
}

// Respuesta
function alCompletarConfirmacion(datos) {
  estadoApp.nombre = datos.nombre || '';
  estadoApp.asistencia = 'SI';
  estadoApp.tieneRestriccion = datos.tieneRestriccion || 'NO';
  estadoApp.detalleRestriccion = datos.detalleRestriccion || '';

  mostrarVistaResultado('success-yes-view');
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
