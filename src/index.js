var deferredPrompt;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("Service Worker Registered !");
    }).catch(error => {
        console.log("Service Worker Registartion Failed !!!");
        console.log(error);
    })
}

window.addEventListener('beforeinstallprompt', event => {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
})