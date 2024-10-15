// Reference the serviceWorker.
const serviceWorker = navigator.serviceWorker;

// Register our ServiceWorker script, if serviceWorker is available.
if (serviceWorker) {
    serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("ServiceWorker Registered to the Application!"))
        .catch(() => console.log("Failed to Register the ServiceWorker."));
}

// Create a variable to defer the beforeinstallprompt event.
let beforeInstallEvent;

// Watch for the beforeinstallevent and defer it.
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    beforeInstallEvent = event;
});
