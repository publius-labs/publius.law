const LOGIN_ENDPOINT = 'http://publius-stg:8095/api/v1/auth/login';
const DEFAULT_REDIRECT_URL = 'https://app.publius.site';

async function handleLogin() {

    console.log("attempting login");

    try {

        window.location.href = DEFAULT_REDIRECT_URL;

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