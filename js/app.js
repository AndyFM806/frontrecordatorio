const API_BASE = "https://demo-pmeu.onrender.com";
let usuarioActual = null;

/* ========== NAVEGACIÓN ========== */
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
}

/* ========== LOGIN ========== */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    usuarioActual = await res.json();
    msg.textContent = "✅ Bienvenido, " + usuarioActual.nombre;
    mostrarSeccion('prestamos');
    cargarPrestamos();
  } catch (err) {
    msg.textContent = "❌ " + err.message;
  }
}

/* ========== REGISTRO ========== */
async function registrar() {
  const nombre = document.getElementById("regNombre").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const msg = document.getElementById("regMsg");

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  if (res.ok) {
    msg.textContent = "✅ Usuario registrado correctamente";
  } else {
    msg.textContent = "❌ Error al registrar usuario";
  }
}

/* ========== CREAR PRÉSTAMO ========== */
async function crearPrestamo() {
  if (!usuarioActual) return alert("Inicia sesión primero");
  const body = {
    monto: parseFloat(document.getElementById("monto").value),
    interes: parseFloat(document.getElementById("interes").value),
    numeroCuotas: parseInt(document.getElementById("cuotas").value)
  };

  const res = await fetch(`${API_BASE}/prestamos/crear?usuarioId=${usuarioActual.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("✅ Préstamo registrado");
    cargarPrestamos();
  } else {
    alert("❌ Error al registrar préstamo");
  }
}

/* ========== LISTAR PRÉSTAMOS ========== */
async function cargarPrestamos() {
  const cont = document.getElementById("listaPrestamos");
  cont.innerHTML = "Cargando...";
  const res = await fetch(`${API_BASE}/prestamos/usuario/${usuarioActual.id}`);
  const prestamos = await res.json();
  cont.innerHTML = "";

  prestamos.forEach(p => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <strong>Préstamo #${p.id}</strong><br>
      Monto: ${p.monto}<br>
      Interés: ${p.interes}%<br>
      Cuotas: ${p.numeroCuotas}<br>
      <button onclick="verCuotas(${p.id})">Ver cuotas</button>
    `;
    cont.appendChild(div);
  });
}

/* ========== VER CUOTAS DE UN PRÉSTAMO ========== */
async function verCuotas(prestamoId) {
  mostrarSeccion("cuotas");
  const cont = document.getElementById("listaCuotas");
  cont.innerHTML = "Cargando...";
  const res = await fetch(`${API_BASE}/cuotas/prestamo/${prestamoId}`);
  const cuotas = await res.json();
  cont.innerHTML = "";

  cuotas.forEach(c => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <strong>Cuota #${c.numero}</strong><br>
      Monto: ${c.monto}<br>
      Vence: ${c.fechaVencimiento}<br>
      Estado: ${c.estado}<br>
      ${c.estado === 'PENDIENTE' ?
        `<button onclick="pagarCuota(${c.id})">Marcar pagada</button>` : ''}
    `;
    cont.appendChild(div);
  });
}

/* ========== PAGAR CUOTA ========== */
async function pagarCuota(id) {
  const res = await fetch(`${API_BASE}/cuotas/${id}/pagar`, { method: "PUT" });
  if (res.ok) {
    alert("💸 Cuota marcada como pagada");
    mostrarSeccion("prestamos");
    cargarPrestamos();
  } else {
    alert("❌ Error al pagar cuota");
  }
}

/* ========== ENVÍO DE CORREO ========== */
async function enviarEmail() {
  const para = document.getElementById("emailPara").value;
  const asunto = document.getElementById("emailAsunto").value;
  const mensaje = document.getElementById("emailMensaje").value;
  const msg = document.getElementById("emailMsg");

  const res = await fetch(`${API_BASE}/email/test/usuario/${usuarioActual ? usuarioActual.id : 1}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asunto, mensaje })
  });

  const text = await res.text();
  msg.textContent = text.includes("Correo enviado") ? "✅ Correo enviado correctamente" : "❌ Error al enviar";
}
