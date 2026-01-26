// Sendinblue form submission handler
document.addEventListener('DOMContentLoaded', function() {
  // Immediately hide all success/error messages on page load
  document.querySelectorAll('.w-form-done, .w-form-fail').forEach(function(msg) {
    msg.style.display = 'none';
  });
  
  const forms = document.querySelectorAll('form[data-sendinblue="true"]');
  
  forms.forEach(function(form) {
    // Prevent Webflow from handling this form
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const submitBtn = form.querySelector('input[type="submit"]');
      const formBlock = form.closest('.form-block');
      const successMsg = formBlock.querySelector('.w-form-done');
      const errorMsg = formBlock.querySelector('.w-form-fail');
      const originalBtnValue = submitBtn.value;
      
      // Check if elements exist
      if (!submitBtn || !successMsg || !errorMsg) {
        console.error('Form elements not found');
        return;
      }
      
      // Hide previous messages
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      // Show loading state
      submitBtn.value = submitBtn.getAttribute('data-wait') || 'Sending...';
      submitBtn.disabled = true;
      
      // Get form data
      const formData = new FormData(form);
      
      // Submit to Sendinblue
      fetch('https://7f9e7916.sibforms.com/serve/MUIFAPZRWBTufYeaMiseC6GamVvUNwZmOoilO8_335uVHxzDG4Vjhzf0HrWmUmyDRCiZCVeloTqFESOfK2t_xO0lx4cb0y-L7MggPXe80OG4hwcnrCs_pJ7xeRRNtA32oNAk4K71p2-GweejjrKslB2cvwPmOkte0yNTbb7qmyJsMvDkGIxz72kbr0Fjg9veAb1M7-szY3f05iuGrw==', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Sendinblue doesn't support CORS, but form still works
      })
      .then(function() {
        // With no-cors, we can't verify success, but assume it worked
        // Ensure error is hidden first
        errorMsg.style.display = 'none';
        
        // Show success message
        successMsg.style.display = 'block';
        form.reset();
        
        // Reset button
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
        
        // Hide success message after 5 seconds
        setTimeout(function() {
          successMsg.style.display = 'none';
        }, 5000);
      })
      .catch(function(error) {
        // Network error occurred
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
        
        // Reset button
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      });
    });
  });
});

