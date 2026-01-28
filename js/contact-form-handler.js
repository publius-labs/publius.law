// Contact form: submit via fetch (same pattern as ideom.com), no redirect, inline success/error.
// Form action must be your Formspree endpoint so emails go to info@publius.law.
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('wf-form-Contact-Form');
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
      if (errorEl) errorEl.style.display = 'block';
      if (submitBtn) {
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      }
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!form.action || form.action.indexOf('formspree.io/f/') === -1) {
        showError();
        return;
      }

      hideMessages();
      if (submitBtn) {
        submitBtn.value = submitBtn.getAttribute('data-wait') || 'Sending...';
        submitBtn.disabled = true;
      }

      var body = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: body
      })
        .then(function(res) {
          if (res.ok) showSuccess();
          else showError();
        })
        .catch(function() {
          showError();
        });
    });
  });
})();
