/* -------------------------------------------------------------------------- */
// Alle interactieve onderdelen voor onze site. We maken van alle inputs een object met zijn eigen eigenschappen.
let email = {};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Twee standaard functies, nog basic, maar kan je nog uitbreiden.
const isValidEmailAddress = function(emailAddress) {
	// Basis manier om e-mailadres te checken.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function(fieldValue) {
	return !fieldValue || !fieldValue.length;
};

const doubleCheckEmailAddress = function() {
	if (isValidEmailAddress(email.input.value)) {
		// Stop met dit veld in de gaten te houden; het is in orde.
		email.input.removeEventListener('input', doubleCheckEmailAddress);
		removeErrors(email);
	} else {
		// Stuk herhalende code.
		if (isEmpty(email.input.value)) {
			email.errorMessage.innerText = 'This field is required';
		} else {
			email.errorMessage.innerText = 'Invalid emailaddress';
		}
	}
};

const addErrors = function(formField) {
	formField.field.classList.add('has-error');
	formField.errorMessage.classList.add('is-visible');
};

const removeErrors = function(formField) {
	formField.field.classList.remove('has-error');
	formField.errorMessage.classList.remove('is-visible');
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
const getDOMElements = function() {
	email.errorMessage = document.querySelector('.js-email-error-message');
	email.input = document.querySelector('.js-email-input');
	email.field = document.querySelector('.js-email-field');

	signInButton = document.querySelector('.js-sign-in-button');
};

const enableListeners = function() {
	email.input.addEventListener('blur', function() {
		if (!isValidEmailAddress(email.input.value)) {
			if (isEmpty(email.input.value)) {
				email.errorMessage.innerText = 'This field is required';
			} else {
				email.errorMessage.innerText = 'Invalid emailaddress';
			}

			addErrors(email);

			// Gebruik een named function (doubleCheckPassword), om die er weer af te kunnen halen. Dit vermijdt ook het dubbel toevoegen ervan.
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});

	signInButton.addEventListener('click', function(e) {
		e.preventDefault();

		if (isValidEmailAddress(email.input.value)) {
			console.log('Form is good to go!');
		} else {
			addErrors(email);
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded 🥳!');
    
	getDOMElements();

	enableListeners();
});
/* -------------------------------------------------------------------------- */