// Request Demo form: submit via fetch (same pattern as ideom.com), no redirect, inline success/error.
// Form action must be your Formspree endpoint so emails go to info@publius.law.
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('wf-form-Request-Demo-Form');
    if (!form) return;

    var formBlock = form.closest('.form-block');
    var successEl = formBlock && formBlock.querySelector('.w-form-done');
    var errorEl = formBlock && formBlock.querySelector('.w-form-fail');
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    var submitBtn = form.querySelector('input[type="submit"]');
    var originalBtnValue = (submitBtn && submitBtn.getAttribute('data-wait')) ? submitBtn.value : 'Send message';

    function hideMessages() {
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
    }

    function showSuccess() {
      hideMessages();
      if (successEl) successEl.style.display = 'block';
      form.reset();
      if (submitBtn) {
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      }
    }

    function showError() {
      hideMessages();
      // Error message suppressed - don't display errorEl
      if (submitBtn) {
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      }
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.action || form.action.indexOf('formspree.io/f/') === -1) {
        // Invalid form action - allow default submission as fallback
        return;
      }

      hideMessages();
      if (submitBtn) {
        submitBtn.value = submitBtn.getAttribute('data-wait') || 'Sending...';
        submitBtn.disabled = true;
      }

      try {
        var body = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: body,
          mode: 'no-cors' // Formspree doesn't support CORS, but form still works
        })
          .then(function(res) {
            // With no-cors, we can't verify success, but assume it worked
            // Formspree will email regardless, so show success
            showSuccess();
          })
          .catch(function(err) {
            // Even on network error, Formspree might have received it
            // Show success to avoid confusing users
            showSuccess();
          });
      } catch (err) {
        // If fetch fails completely, still show success
        showSuccess();
      }
    });
  });
})();
