"use strict";

/*
 * Mercadão do Victor — demonstração com Local Storage.
 * Os dados ficam apenas neste navegador e não são enviados a um servidor.
 * Para um projeto real, não armazene senhas em texto puro no Local Storage.
 */
const USERS_KEY = "mercadaoVictor_users";
const SESSION_KEY = "mercadaoVictor_session";
const CART_KEY = "mercadaoVictor_cart";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Não foi possível ler ${key}:`, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setCurrentYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

function updateHeader() {
  const actions = document.querySelector("#headerActions");
  if (!actions) return;
  const session = readJSON(SESSION_KEY, null);
  if (session && session.email) {
    const name = session.name || "Cliente";
    actions.innerHTML = `
      <span class="welcome-user">Olá, ${escapeHTML(name.split(" ")[0])}</span>
      <button class="btn btn-outline" id="logoutButton" type="button">Sair</button>
    `;
    document.querySelector("#logoutButton").addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    });
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function handleRegister() {
  const form = document.querySelector("#registerForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    const errorBox = document.querySelector("#registerError");
    errorBox.textContent = "";

    if (name.length < 2) {
      errorBox.textContent = "Informe seu nome completo.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorBox.textContent = "Informe um e-mail válido.";
      return;
    }
    if (password.length < 6) {
      errorBox.textContent = "A senha deve ter pelo menos 6 caracteres.";
      return;
    }
    if (password !== confirmPassword) {
      errorBox.textContent = "As senhas não coincidem.";
      return;
    }

    const users = readJSON(USERS_KEY, []);
    if (users.some(user => user.email === email)) {
      errorBox.textContent = "Já existe uma conta cadastrada com esse e-mail.";
      return;
    }

    // Somente para fins didáticos. Não use armazenamento de senha assim em produção.
    users.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    });
    saveJSON(USERS_KEY, users);
    window.location.href = "login.html?cadastro=sucesso";
  });
}

function handleLogin() {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("cadastro") === "sucesso") {
    const errorBox = document.querySelector("#loginError");
    errorBox.style.color = "#236b45";
    errorBox.textContent = "Cadastro realizado. Entre com seu e-mail e senha.";
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const password = document.querySelector("#password").value;
    const errorBox = document.querySelector("#loginError");
    errorBox.style.color = "";
    errorBox.textContent = "";

    const users = readJSON(USERS_KEY, []);
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) {
      errorBox.textContent = "E-mail ou senha incorretos.";
      return;
    }

    saveJSON(SESSION_KEY, { id: user.id, name: user.name, email: user.email });
    window.location.href = "index.html";
  });
}

function handleAddToCart() {
  document.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product;
      const cart = readJSON(CART_KEY, []);
      const existing = cart.find(item => item.name === productName);
      if (existing) existing.quantity += 1;
      else cart.push({ name: productName, quantity: 1 });
      saveJSON(CART_KEY, cart);
      showToast(`${productName} adicionado à lista de compras.`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  updateHeader();
  handleRegister();
  handleLogin();
  handleAddToCart();
});
