// ===== Navigation =====
(function() {
  const nav = document.querySelector('.nav');
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  const mobileMenu = document.querySelector('.nav__mobile-menu');


  // Scroll effect
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Toggle icon
      const icons = mobileToggle.querySelectorAll('svg');
      icons[0].style.display = isOpen ? 'none' : 'block'; // hamburger
      icons[1].style.display = isOpen ? 'block' : 'none'; // close
    });
  }

})();

// ===== Scroll Animations =====
(function() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
    observer.observe(el);
  });
})();

// ===== Form Handling =====
var FORMSPREE_URL = 'https://formspree.io/f/xlgbkyzz';
var SENDINBLUE_URL = 'https://7f9e7916.sibforms.com/serve/MUIFAPZRWBTufYeaMiseC6GamVvUNwZmOoilO8_335uVHxzDG4Vjhzf0HrWmUmyDRCiZCVeloTqFESOfK2t_xO0lx4cb0y-L7MggPXe80OG4hwcnrCs_pJ7xeRRNtA32oNAk4K71p2-GweejjrKslB2cvwPmOkte0yNTbb7qmyJsMvDkGIxz72kbr0Fjg9veAb1M7-szY3f05iuGrw==';

function showFormMessage(form, type) {
  var msg = form.querySelector('.form-message--' + type);
  if (msg) {
    msg.style.display = 'block';
    if (type === 'success') {
      setTimeout(function() { msg.style.display = 'none'; }, 5000);
    }
  }
}

function hideFormMessages(form) {
  form.querySelectorAll('.form-message').forEach(function(msg) {
    msg.style.display = 'none';
  });
}

function setSubmitState(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

document.querySelectorAll('form[data-form]').forEach(function(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var formType = form.getAttribute('data-form');
    var submitBtn = form.querySelector('[type="submit"]');

    hideFormMessages(form);

    if (formType === 'demo' || formType === 'contact') {
      var formData = new FormData(form);
      if (formType === 'demo') {
        formData.append('_subject', 'Publius demo request');
      } else {
        formData.append('_subject', 'Publius contact form submission');
      }

      setSubmitState(submitBtn, true);

      fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).then(function() {
        setSubmitState(submitBtn, false);
        showFormMessage(form, 'success');
        form.reset();
      }).catch(function() {
        setSubmitState(submitBtn, false);
        showFormMessage(form, 'success');
        form.reset();
      });

    } else if (formType === 'subscribe') {
      var emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value) return;

      var formData = new FormData(form);

      setSubmitState(submitBtn, true);

      fetch(SENDINBLUE_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).then(function() {
        setSubmitState(submitBtn, false);
        showFormMessage(form, 'success');
        form.reset();
      }).catch(function() {
        setSubmitState(submitBtn, false);
        showFormMessage(form, 'error');
      });

    } else if (formType === 'login') {
      alert('Login functionality would be implemented here.');
    }
  });
});

// ===== Password Toggle =====
(function() {
  var toggleBtn = document.querySelector('.login-form__password-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      var input = document.getElementById('password');
      var eyeOpen = toggleBtn.querySelector('.eye-open');
      var eyeClosed = toggleBtn.querySelector('.eye-closed');
      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  }
})();
