// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
    setupDynamicFields();
});

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
}

function setupDynamicFields() {
    // Auto-format phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
    
    // Auto-format PIN codes
    const pincodeInputs = document.querySelectorAll('input[pattern="[0-9]{6}"]');
    pincodeInputs.forEach(input => {
        input.addEventListener('input', formatPincode);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error states
    field.classList.remove('error', 'valid');
    removeErrorMessage(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit mobile number';
        }
    }
    
    // PIN code validation
    if (field.pattern === '[0-9]{6}' && value) {
        if (!/^\d{6}$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 6-digit PIN code';
        }
    }
    
    // Apply validation state
    if (isValid && value) {
        field.classList.add('valid');
    } else if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function clearErrors(event) {
    const field = event.target;
    field.classList.remove('error');
    removeErrorMessage(field);
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    event.target.value = value;
}

function formatPincode(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.slice(0, 6);
    }
    event.target.value = value;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        const isFieldValid = validateField({ target: input });
        if (!isFieldValid) {
            isFormValid = false;
        }
    });
    
    // Validate checkboxes for food types and operating days
    const foodTypesChecked = form.querySelectorAll('input[name="foodTypes"]:checked').length > 0;
    const operatingDaysChecked = form.querySelectorAll('input[name="operatingDays"]:checked').length > 0;
    
    if (form.id === 'donorForm' && !foodTypesChecked) {
        showFormError('Please select at least one type of food you typically share');
        isFormValid = false;
    }
    
    if (form.id === 'receiverForm' && operatingDaysChecked === false) {
        // Operating days are optional for receivers, so we don't validate this
    }
    
    return isFormValid;
}

function showFormError(message) {
    // Create or update form-level error message
    let errorContainer = document.querySelector('.form-error');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.style.cssText = `
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        `;
        const form = document.querySelector('form');
        form.insertBefore(errorContainer, form.firstChild);
    }
    errorContainer.textContent = message;
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeFormError() {
    const errorContainer = document.querySelector('.form-error');
    if (errorContainer) {
        errorContainer.remove();
    }
}

// Form submission handlers
function handleDonorSubmit(event) {
    event.preventDefault();
    removeFormError();
    
    const form = event.target;
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const donorData = {
        type: formData.get('donorType') || form.querySelector('#donorType').value,
        fullName: formData.get('fullName') || form.querySelector('#fullName').value,
        email: formData.get('email') || form.querySelector('#email').value,
        phone: formData.get('phone') || form.querySelector('#phone').value,
        address: formData.get('address') || form.querySelector('#address').value,
        city: formData.get('city') || form.querySelector('#city').value,
        pincode: formData.get('pincode') || form.querySelector('#pincode').value,
        foodTypes: Array.from(form.querySelectorAll('input[name="foodTypes"]:checked')).map(cb => cb.value),
        availability: formData.get('availability') || form.querySelector('#availability').value,
        quantity: formData.get('quantity') || form.querySelector('#quantity').value,
        registrationDate: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage (replace with actual API call)
        const existingDonors = JSON.parse(localStorage.getItem('binbuddy_donors') || '[]');
        donorData.id = Date.now();
        existingDonors.push(donorData);
        localStorage.setItem('binbuddy_donors', JSON.stringify(existingDonors));
        
        // Update current user
        if (window.currentUser) {
            window.currentUser.role = 'donor';
            window.currentUser.profile = donorData;
            localStorage.setItem('binbuddy_user', JSON.stringify(window.currentUser));
        }
        
        // Show success page
        showSuccessPage('donor');
    }, 2000);
}

function handleReceiverSubmit(event) {
    event.preventDefault();
    removeFormError();
    
    const form = event.target;
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const receiverData = {
        orgType: formData.get('orgType') || form.querySelector('#orgType').value,
        orgName: formData.get('orgName') || form.querySelector('#orgName').value,
        registrationNumber: formData.get('registrationNumber') || form.querySelector('#registrationNumber').value,
        contactName: formData.get('contactName') || form.querySelector('#contactName').value,
        designation: formData.get('designation') || form.querySelector('#designation').value,
        email: formData.get('email') || form.querySelector('#email').value,
        phone: formData.get('phone') || form.querySelector('#phone').value,
        altPhone: formData.get('altPhone') || form.querySelector('#altPhone').value,
        address: formData.get('address') || form.querySelector('#address').value,
        city: formData.get('city') || form.querySelector('#city').value,
        pincode: formData.get('pincode') || form.querySelector('#pincode').value,
        serviceRadius: formData.get('serviceRadius') || form.querySelector('#serviceRadius').value,
        beneficiaries: formData.get('beneficiaries') || form.querySelector('#beneficiaries').value,
        operatingHours: formData.get('operatingHours') || form.querySelector('#operatingHours').value,
        operatingDays: Array.from(form.querySelectorAll('input[name="operatingDays"]:checked')).map(cb => cb.value),
        description: formData.get('description') || form.querySelector('#description').value,
        registrationDate: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage (replace with actual API call)
        const existingReceivers = JSON.parse(localStorage.getItem('binbuddy_receivers') || '[]');
        receiverData.id = Date.now();
        existingReceivers.push(receiverData);
        localStorage.setItem('binbuddy_receivers', JSON.stringify(existingReceivers));
        
        // Update current user
        if (window.currentUser) {
            window.currentUser.role = 'receiver';
            window.currentUser.profile = receiverData;
            localStorage.setItem('binbuddy_user', JSON.stringify(window.currentUser));
        }
        
        // Show success page
        showSuccessPage('receiver');
    }, 2000);
}

function showSuccessPage(role) {
    document.body.innerHTML = `
        <div class="success-page">
            <div class="success-container">
                <div class="success-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 class="success-title">Registration Successful!</h1>
                <p class="success-message">
                    Welcome to BinBuddy! Your ${role} profile has been created successfully. 
                    You can now start ${role === 'donor' ? 'sharing food with those in need' : 'requesting food for your community'}.
                </p>
                <div class="success-actions">
                    <button class="btn btn-primary btn-large" onclick="goToDashboard()">
                        Go to Dashboard
                    </button>
                    <button class="btn btn-outline btn-large" onclick="goToHome()">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    `;
}

function goToDashboard() {
    window.location.href = '/';
    setTimeout(() => {
        if (window.showDashboard) {
            window.showDashboard();
        }
    }, 100);
}

function goToHome() {
    window.location.href = '/';
}

// Export functions for global access
window.handleDonorSubmit = handleDonorSubmit;
window.handleReceiverSubmit = handleReceiverSubmit;
window.goToDashboard = goToDashboard;
window.goToHome = goToHome;