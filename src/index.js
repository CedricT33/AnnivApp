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
});

// function displayConfirmNotification(options, delai) {
//     if ("showTrigger" in Notification.prototype) {
//         console.log('shoooowtrigger supported !')
//       }
//       else {
//         console.log('showtrigger NOT supported !')
//       }
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.ready.then(swreg => {
//             setTimeout(function() {
//                 swreg.showNotification('Anniversaire !!', options);
//             }, delai);
            
//         });
//     }
// }

function registerPeriodicNotification(options, delai) {
    navigator.serviceWorker.ready.then(swreg => {
        console.log('enregistrement periodic !', swreg);
        var titre = 'Anniversaire_de_' + options.body;
        return swreg.periodicSync.register(titre, {
            minInterval: 10000,
          }).then( function() {
              return swreg;
          });
    }).then(sw => {
        sw.periodicSync.getTags().then(tags => {
            console.log('tags :', tags);
            console.log('ps : ', sw.periodicSync);
          });  
    }).catch(e => {
        console.log('Periodic Sync could not be registered!', e);
    });
}

function askForNotificationPermission() {
    console.log(Notification);
    Notification.requestPermission(result => {
        if (result === 'granted') {
            console.log('permission notifs OK !');
        }
    })
}