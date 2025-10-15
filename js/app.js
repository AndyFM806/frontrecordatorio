const API_URL = "https://demo-pmeu.onrender.com";

document.getElementById("btnLogin").onclick = () => toggleForm("login");
document.getElementById("btnRegister").onclick = () => toggleForm("register");

function toggleForm(type) {
  document.getElementById("loginForm").classList.toggle("hidden", type !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", type !== "register");
  document.getElementById("btnLogin").classList.toggle("active", type === "login");
  document.getElementById("btnRegister").classList.toggle("active", type === "register");
}

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const usuario = await res.json();
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("loginError").textContent = "❌ Credenciales inválidas";
  }
});

// REGISTRO
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("regNombre").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });

    if (!res.ok) throw new Error("Error al registrar");
    document.getElementById("registerMsg").textContent = "✅ Usuario registrado correctamente";
  } catch (err) {
    document.getElementById("registerMsg").textContent = "❌ Error al registrar";
  }
});
