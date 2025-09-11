import axios from 'axios';

window.axios = axios;

// Set the base URL for all axios requests to the current page's origin.
// This dynamically adapts to the environment (e.g., localhost, 127.0.0.1, production domain)
// and prevents CORS issues caused by host/port mismatches.
window.axios.defaults.baseURL = window.location.origin;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * We'll grab the CSRF token from the meta tag and set it as a default header.
 * This way, all outgoing axios requests will have it automatically.
 */
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
