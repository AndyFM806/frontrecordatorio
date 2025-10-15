const API_URL = "https://demo-pmeu.onrender.com";
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "index.html";
}

document.getElementById("userName").textContent = usuario.nombre;

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
});

// CARGAR PRÉSTAMOS
async function cargarPrestamos() {
  const res = await fetch(`${API_URL}/prestamos/usuario/${usuario.id}`);
  const prestamos = await res.json();

  const container = document.getElementById("prestamosList");
  container.innerHTML = prestamos.length
    ? prestamos.map(p => `<div class="card">💵 ${p.monto} - ${p.fechaEmision}</div>`).join("")
    : "<p>No tienes préstamos registrados.</p>";
}

// CARGAR CUOTAS
async function cargarCuotas() {
  const res = await fetch(`${API_URL}/cuotas/pendientes/usuario/${usuario.id}`);
  const cuotas = await res.json();

  const container = document.getElementById("cuotasList");
  container.innerHTML = cuotas.length
    ? cuotas.map(c => `<div class="card">💳 ${c.montoCuota} - ${c.estado}</div>`).join("")
    : "<p>No tienes cuotas pendientes.</p>";
}

// CORREO TEST
document.getElementById("btnCorreo").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/email/test/usuario/${usuario.id}`, { method: "POST" });
  document.getElementById("correoMsg").textContent = res.ok
    ? "✅ Correo enviado correctamente"
    : "❌ Error al enviar correo";
});

// Cargar todo al inicio
cargarPrestamos();
cargarCuotas();
