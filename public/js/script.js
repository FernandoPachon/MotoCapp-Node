document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('message').textContent = "✅ Login exitoso!";
        } else {
            document.getElementById('message').textContent = "❌ Error: " + result.error;
        }
    } catch (error) {
        document.getElementById('message').textContent = "⚠️ Error de conexión";
    }
    
});