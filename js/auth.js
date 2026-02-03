const LOGIN_ENDPOINT = 'http://publius-stg:8095/api/v1/auth/login';
const DEFAULT_REDIRECT_URL = 'https://app.publius.law';

async function handleLogin() {
    const loginName = document.getElementById('wf-log-in-email').value;
    const password = document.getElementById('wf-log-in-password').value;

    console.log("attempting login");

    try {
        // 1. "Encrypt" (Hash) the password using Web Crypto API
        const hashedPassword = await hashString(password);

        // 2. Send credentials to your server
        // Replace '/api/v1/auth/login' with your actual server endpoint
        let response;

        response = await fetch(LOGIN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                login_name: loginName,
                password_hash: hashedPassword
            })
        });

        // 3. Handle the server response
        let responseBody = null;
        try {
            responseBody = await response.json();
        } catch (parseError) {
            responseBody = null;
        }

        if (response.ok) {
            const redirectUrl = responseBody?.redirect_url;
            if (typeof redirectUrl === 'string' && redirectUrl.length > 0) {
                window.location.href = redirectUrl;
            } else {
                console.warn('Login succeeded, but redirect_url missing. Falling back.');
                window.location.href = DEFAULT_REDIRECT_URL;
            }
        } else {
            // Login failed
            const errorDetail = responseBody?.detail || response.statusText || 'Login failed';
            console.error(`Login failed: ${errorDetail}`);
        }

    } catch (error) {
        console.error("Login error:", error);
    }
}

// Helper function: Uses Web Crypto API to create a SHA-256 hash
async function hashString(message) {
    // encode as (utf-8) Uint8Array
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form[data-wf-user-form-type="login"]');
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleLogin();
    });
});