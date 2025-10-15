document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://demo-pmeu.onrender.com"; // sin /api

  const userData = JSON.parse(localStorage.getItem("usuario"));
  const userNombre = document.getElementById("userNombre");
  const userCorreo = document.getElementById("userCorreo");
  const prestamosContainer = document.getElementById("prestamosContainer");
  const btnLogout = document.getElementById("btnLogout");
  const btnEnviarCorreo = document.getElementById("btnEnviarCorreo");

  // Verificar login
  if (!userData) {
    window.location.href = "index.html";
    return;
  }

  userNombre.textContent = userData.nombre;
  userCorreo.textContent = userData.email;

  // Cargar préstamos del usuario
  async function cargarPrestamos() {
    try {
      const res = await fetch(`${API_URL}/prestamos/usuario/${userData.id}`);
      if (!res.ok) throw new Error("Error al obtener préstamos");
      const prestamos = await res.json();

      if (!prestamos.length) {
        prestamosContainer.innerHTML = `<p>No tienes préstamos registrados.</p>`;
        return;
      }

      prestamosContainer.innerHTML = "";
      prestamos.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("prestamo-card");
        card.innerHTML = `
          <div class="prestamo-header">
            <h3>Préstamo #${p.id}</h3>
            <span><strong>Monto:</strong> S/.${p.monto.toFixed(2)}</span>
          </div>
          <p><strong>Interés:</strong> ${p.interes}%</p>
          <p><strong>Emitido:</strong> ${p.fechaEmision}</p>
          <p><strong>Cuotas:</strong></p>
          <div class="cuotas-list">
            ${p.cuotas.map(c => `
              <div class="cuota-item">
                <span>Cuota ${c.numero} - vence ${c.fechaVencimiento}</span>
                <span class="estado ${c.estado.toLowerCase()}">${c.estado}</span>
              </div>
            `).join("")}
          </div>
        `;
        prestamosContainer.appendChild(card);
      });

    } catch (error) {
      prestamosContainer.innerHTML = `<p style="color:red;">Error al cargar préstamos.</p>`;
      console.error(error);
    }
  }

  cargarPrestamos();

  // Enviar correo de prueba
  btnEnviarCorreo.addEventListener("click", async () => {
    try {
      const res = await fetch(`${API_URL}/email/test/usuario/${userData.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const msg = await res.text();
      alert("✅ " + msg);
    } catch (error) {
      alert("❌ Error al enviar correo");
    }
  });

  // Cerrar sesión
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });
});
