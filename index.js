loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = JSON.parse(localStorage.getItem(email));

  if (user && user.password === password) {
    userNameDisplay.textContent = user.name;
    alert("Login successful! Redirecting to home.");
    showSection(homeSection);
    showproject();
  } else {
    loginError.textContent = "Invalid email or password!";
  }
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (localStorage.getItem(email)) {
    registerError.textContent = "Email is already registered!";
  } else {
    localStorage.setItem(email, JSON.stringify({ name, password }));
    alert("Registration successful! Redirecting to login.");
    showSection(loginSection);
    showproject();
  }
});
