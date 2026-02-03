const DEFAULT_REDIRECT_URL = 'https://app.publius.site';

// Configure valid credentials here (for client-side demo only - use server-side auth in production)
const VALID_CREDENTIALS = {
  email: 'ed@publius.law',
  password: '123456'
};

function showError(message) {
  const errorEl = document.querySelector('.w-users-userformerrorstate');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.setProperty('display', 'block', 'important');
  }
}

function hideError() {
  const errorEl = document.querySelector('.w-users-userformerrorstate');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.setProperty('display', 'none', 'important');
  }
}

function handleLogin(event) {
  event.preventDefault();

  const form = document.getElementById('login-form');
  if (!form) return;

  const email = form.querySelector('#wf-log-in-email')?.value?.trim();
  const password = form.querySelector('#wf-log-in-password')?.value;

  hideError();

  if (!email || !password) {
    showError('Please enter your email and password.');
    return;
  }

  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    window.location.href = DEFAULT_REDIRECT_URL;
  } else {
    showError('Invalid email or password. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', handleLogin);
});
