document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passError = document.getElementById('passError');
    
    let isValid = true;

    // Email Validation (Regex)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = "Please enter a valid medical email.";
        emailError.style.display = "block";
        email.style.borderColor = "#e74c3c";
        isValid = false;
    } else {
        emailError.style.display = "none";
        email.style.borderColor = "#ddd";
    }

    // Password Validation
    if (password.value.length < 6) {
        passError.textContent = "Password must be at least 6 characters.";
        passError.style.display = "block";
        password.style.borderColor = "#e74c3c";
        isValid = false;
    } else {
        passError.style.display = "none";
        password.style.borderColor = "#ddd";
    }

    if (isValid) {
        alert("Login successful! Redirecting to dashboard...");
        window.location.href = "dashboard.html";
    }
});