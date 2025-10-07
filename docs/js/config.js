const API_BASE_URL = 'https://29de8ff5-3cc2-4282-9da2-eade13bd4b74-00-1wj0fsnqh7z6e.riker.replit.dev';

function getApiUrl(endpoint) {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.includes('replit.dev') ||
        window.location.hostname.includes('127.0.0.1')) {
        return endpoint;
    }
    return `${API_BASE_URL}${endpoint}`;
}
