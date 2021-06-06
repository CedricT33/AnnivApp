/** ----- CONSTANTES ------ */
var version = "01.00.016";
var storage = [];
var SIGNES_ASTRO = ["Capricorne", "Verseau", "Poisson", "Bélier", "Taureau", "Gémeau", "Cancer",
                    "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire"];
var LIMITES_SIGNES_ASTRO = [20,19,20,20,20,21,22,22,21,22,21,21];
var SIGNES_CHINOIS = ["Rat", "Boeuf", "Tigre", "Lapin", "Dragon", "Serpent", "Cheval",
                    "Chèvre", "Singe", "Coq","Chien", "Cochon"];
var optionsNotification = {
    body: '',
    icon: '/images/logo96.png',
    lang: 'fr-FR',
    vibrate: [100, 50, 200],
    badge: '/images/logo96.png',
    tag: 'confirm-notification'
};
var miseAJour = {
    date: "06/06/2021",
    texte: "- Ajout d'une fonctionnalité d'enregistrement des anniversaires sur le portable.\n" +
            "- Amélioration du temps restant avant l'anniversaire.\n" +
            "- Popin de mises à jour (nouveautées)."
};

//** -----DESTRUCTION POPIN----- */
function detruirePopin() {
    var elmtPopin = document.getElementById('popin');
    var elmtMasquePopin = document.getElementById('popin-masque');
    var elmtPopinTitre = document.getElementById('popin-titre');
    var elmtPopinCorps = document.getElementById('popin-corps');
  
    elmtPopinTitre.innerText = '';
    elmtPopinCorps.innerText = '';
    elmtPopin.classList.remove('open');
    elmtMasquePopin.classList.remove('open');
}
  
//** -----CREATION POPIN----- */
  function creationPopin(titre, corps) {
    var elmtPopin = document.getElementById('popin');
    var elmtMasquePopin = document.getElementById('popin-masque');
    var elmtPopinTitre = document.getElementById('popin-titre');
    var elmtPopinCorps = document.getElementById('popin-corps');
  
    elmtPopinTitre.innerText = titre;
    elmtPopinCorps.innerText = corps;
    elmtPopin.classList.add('open');
    elmtMasquePopin.classList.add('open');
}

//** -----OUVERTURE POPIN SUPPRESSION----- */
function ouverturePopinSuppression(prenom) {
    var titre = 'SUPPRESSION';
    var corps = 'Etes-vous sûr de vouloir supprimer ' + prenom + ' ?';
    creationPopin(titre, corps);
}

//** -----OUVERTURE POPIN VERSION----- */
function ouverturePopinVersion(version) {
    var titre = 'VERSION';
    var corps = version;
    creationPopin(titre, corps);
}

//** -----OUVERTURE POPIN MAJ----- */
function ouverturePopinMAJ(miseAJour) {
    document.getElementById('index-popin').value = 'maj';
    var titre = 'NOUVEAUTEES';
    var corps = miseAJour.texte;
    creationPopin(titre, corps);
}

//** -----OUVERTURE POPIN CSV----- */
function ouverturePopinCSV() {
    document.getElementById('index-popin').value = 'csv';
    var titre = 'ENREGISTREMENT';
    var corps = 'Voulez-vous enregistrer les anniversaires dans un fichier Annivs.csv ?';
    creationPopin(titre, corps);
}

/** ----- AU CLIC SUR UNE VIGNETTE ------ */
function clickAccordeon(element) {
    var elmtsAccordeons = document.getElementsByClassName("accordeon-content");
    var listClassElmt = element.nextElementSibling.classList;

    if (listClassElmt.contains('active')) {
        listClassElmt.remove('active');
    }
    else {
        for (let elmt of elmtsAccordeons) {
            if (elmt.classList.contains('active')) {
                elmt.classList.remove('active');
            }
        }
        listClassElmt.add('active');
    }
}

/** ----- SUPPRESSION D'UNE DONNEE DU LOCAL STORAGE ------ */
function supprimerDonneeStorage(index) {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    storage.forEach( (elmt, id) => {
        if (elmt.index == index) {
            storage.splice(id, 1);
        }
    })
    localStorage.setItem("vignettes", JSON.stringify(storage));
    affichageLocal();
    gestionAffichagePresentation()
    reinitialiserSwipper();
}

/** ----- AU CLIC SUR SUPPRIMER UNE VIGNETTE ------ */
function clickSuppr(element) {
    var index = element.id.substr(6,1);
    document.getElementById('index-popin').value = index;
    var prenom = '';
    storage = JSON.parse(localStorage.getItem("vignettes"));
    storage.forEach( elmt => {
        if (elmt.index == index) {
            prenom = elmt.prenom;
        }
    })
    ouverturePopinSuppression(prenom);
}

//TODO en test
function calculTempsJusquAAnniv(jour, mois, annee, heureNotif) {
    var now = new Date();
    //var dateDAnniv = new Date(annee, mois-1, jour, heureNotif, 59, 0, 0) - now;
    //console.log(dateDAnniv);
    optionsNotification.body = 'Truc_30_ans';
    optionsNotification.showTrigger = new TimestampTrigger(now + 10000);
    console.log(now);
    displayScheduledNotification(optionsNotification);
}

/** ----- AU CLIC SUR MODIFIER UNE VIGNETTE ------ */
function clickModif(element) {
    var index = element.id.substring(6);
    remplirFormulaire(index);  
    faireApparaitrePageFormulaire();

    //TODO a supprimer (en test)
    //calculTempsJusquAAnniv(26, 9, 2020, 17);

}

/** ----- AU CLIC SUR AJOUTER UNE VIGNETTE ------ */
function clickAjout() {
    // affichage de l'ajout sur page accueil device
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
            console.log(choiceResult.outcome);

            if (choiceResult.outcome === 'dismissed') {
                console.log('User cancelled installation');
            }
            else {
                console.log('User added to home screen');
            }
        });

        deferredPrompt = null;
    }
    faireApparaitrePageFormulaire(); 
}

/** ----- AU CLIC SUR LE SWIPPER ------ */
function clickSwipper() {
    var elmtGateau = document.getElementById("gateau");
    var elmtAstro = document.getElementById("astro");
    var elmtAstroChinois = document.getElementById("astrochinois");
    var elmtsAge = document.getElementsByClassName('age');
    var elmtsAstro = document.getElementsByClassName('astro-normal');
    var elmtsAstroChinois = document.getElementsByClassName('astro-chinois');

    if (elmtGateau.classList.contains('active')) {
        elmtAstro.classList.add('active');
        elmtGateau.classList.remove('active');
        for (let elmt of elmtsAstro) {
            elmt.classList.add('active');
        }
        for (let elmt of elmtsAge) {
            elmt.classList.remove('active');
        }
    }
    else if (elmtAstro.classList.contains('active')) {
        elmtAstroChinois.classList.add('active');
        elmtAstro.classList.remove('active');
        for (let elmt of elmtsAstroChinois) {
            elmt.classList.add('active');
        }
        for (let elmt of elmtsAstro) {
            elmt.classList.remove('active');
        }
    }
    else {
        elmtGateau.classList.add('active');
        elmtAstroChinois.classList.remove('active');
        for (let elmt of elmtsAge) {
            elmt.classList.add('active');
        }
        for (let elmt of elmtsAstroChinois) {
            elmt.classList.remove('active');
        }
    }
}

/** ----- RECUPERATION DE LA VERSION DEPUIS LE SW ------ */
/**function getVersion() {
    const channel = new BroadcastChannel('sw-version');
    channel.addEventListener('message', event => {
        localStorage.setItem("version", event.data.version);
        version = localStorage.getItem("version");
        var elemtLogo = document.getElementById('logo');
        dbleClick(elemtLogo, ouverturePopinVersion, version);
    });
}*/

/** ----- AU DOUBLE CLIC SUR LE LOGO (VERSION) ------ */
function ajoutEvtDbleClickLogo() {
    document.getElementById('index-popin').value = 'version';
    var elemtLogo = document.getElementById('logo');
    //version = localStorage.getItem("version");
    dbleClick(elemtLogo, ouverturePopinVersion, version);
}

/** ----- GESTION DU DOUBLE CLIC SUR MOBILE ------ */
function dbleClick(elmt, fonctionAppellee, argumentFonction) {
    var touchtime = 0;
    elmt.onclick = function() {
        if (touchtime == 0) {
            // set first click
            touchtime = new Date().getTime();
        } else {
            // compare first click to this click and see if they occurred within double click threshold
            if (((new Date().getTime()) - touchtime) < 800) {
                // double click occurred
                fonctionAppellee(argumentFonction);
                touchtime = 0;
            } else {
                // not a double click so set as a new first click
                touchtime = new Date().getTime();
            }
        }
    };
}

/** ----- RETOURNE L'INDEX LE PLUS GRAND DE LA LISTE + 1 ------ */
function recupererIndexMax() {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    var tableauIndex = [];
    if (!storage || storage.length === 0) {
        return 1;
    }
    else {
        storage.forEach(elmt => {
            tableauIndex.push(elmt.index);
        })
        return (Math.max(...tableauIndex) + 1);
    }
}

/** ----- AU CLIC SUR VALIDATION POPIN ------ */
function clickOKPopin() {
    var valueIndex = document.getElementById('index-popin').value;
    if(valueIndex !== 'version' && valueIndex !== 'maj' && valueIndex !== 'csv') {
        supprimerDonneeStorage(valueIndex);
    }
    else if(valueIndex === 'csv'){
        sauvegardeCSV();
    }
    detruirePopin();
}

/** ----- AU CLIC SUR VALIDATION FORMULAIRE ------ */
function clickOK() {
    var elemtIndex = document.getElementById('index').value;
    var saisieNom = document.getElementById('saisieNom').value;
    var saisiePrenom = document.getElementById('saisiePrenom').value;
    var saisieJour = document.getElementById('saisieJour').value;
    var saisieMois = document.getElementById('saisieMois').value;
    var saisieAnnee = document.getElementById('saisieAnnee').value;

    var objetVignette = {
        index: elemtIndex ? Number(elemtIndex) : recupererIndexMax(),
        nom: saisieNom,
        prenom: saisiePrenom,
        jour: saisieJour,
        mois: saisieMois,
        annee: saisieAnnee
    };

    var controleOK = controleSaisie(objetVignette);
    if (controleOK) {
        ajoutLocal(objetVignette);
        affichageLocal();
        faireDisparaitrePageFormulaire();
        gestionAffichagePresentation();
        reinitialiserSwipper();  
    }
    else {
        //TODO -> popin erreur?
    }
}

/** ----- AU CLIC SUR RETOUR ------ */
function clickRetour() {
    faireDisparaitrePageFormulaire();
    gestionAffichagePresentation();
}

/** ----- AU CLIC SUR PARAMETRES ------ */
function clickParams() {
    ouverturePopinCSV();
}

/** ----- SAUVEGARDE AU FORMAT CSV ------ */
function sauvegardeCSV() {
    var fichierCSV = 'data:text/csv;charset=utf-8,\n index,nom,prenom,jour,mois,annee\n';
    if (storage.length !== 0) {
        storage.forEach(elmtObjet => {
            Object.entries(elmtObjet).forEach(([key, value]) => {
                fichierCSV += value + ',';
            })
            fichierCSV += '\n';
        })
        downloadCSV(fichierCSV);
    }
}

/** ----- TELECHARGEMENT DU FICHIER CSV ------ */
function downloadCSV(fichierCSV) {
    var encodedUri = encodeURI(fichierCSV);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "annivs.csv");
    document.body.appendChild(link);
    link.click();
    //TODO afficher popin de confirmation ?
}

/** ----- RECUPERE L'OBJET DU LOCAL STORAGE AVEC L'INDEX ------ */
function recupererObjetVignette(index) {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    var element = {};
    storage.forEach(elmt => {
        if (elmt.index == index) {
            element = elmt;
        }
    })
    return element;
}

/** ----- LE FORMULAIRE SE REMPLIT GRACE A L'INDEX ------ */
function remplirFormulaire(index) {
    var objetVignette = recupererObjetVignette(index);
    document.getElementById('index').value = objetVignette.index;
    document.getElementById('saisieNom').value = objetVignette.nom;
    document.getElementById('saisiePrenom').value = objetVignette.prenom;
    document.getElementById('saisieJour').value = objetVignette.jour;
    document.getElementById('saisieMois').value = objetVignette.mois;
    document.getElementById('saisieAnnee').value = objetVignette.annee;

    
}

function ajouterEcouteurDate() {
    var elmtJour = document.getElementById('saisieJour');
    var elmtMois = document.getElementById('saisieMois');
    var elmtAnnee = document.getElementById('saisieAnnee');
    var btnOK = document.getElementById('btn-ok');

    elmtJour.onkeyup = event => {
        if (saisieJour.value.length >= 2) {
            elmtMois.focus();
        }
    }

    elmtMois.onkeyup = event => {
        if (elmtMois.value.length >= 2) {
            elmtAnnee.focus();
        }
    }

    elmtAnnee.onkeyup = event => {
        if (elmtAnnee.value.length >= 4) {
            btnOK.focus();
        }
    }

}

/** ----- FAIRE APPARAITRE LA PAGE D'AJOUT/MODIFICATION DE VIGNETTE ------ */
function faireApparaitrePageFormulaire() {
    var elmtSwipper = document.getElementById('swipper');
    var elmtListConteneur = document.getElementById('list-container');
    var btnAjouter = document.getElementById('img-ajouter');
    var btnRetour = document.getElementById('img-retour');
    var elmtAjoutConteneur = document.getElementById('ajout-container');
    var elmtFleche = document.getElementById('fleche-presentation');
    var elmtPresentation = document.getElementById('presentation-container');

    elmtSwipper.classList.add('hide');
    elmtListConteneur.classList.add('hide');
    btnAjouter.classList.add('hide');
    elmtFleche.classList.add('hide');
    elmtPresentation.classList.add('hide');
    btnRetour.classList.add('show');
    elmtAjoutConteneur.classList.add('show');

    ajouterEcouteurDate();
}

/** ----- FAIRE DISPARAITRE LA PAGE D'AJOUT/MODIFICATION DE VIGNETTE ------ */
function faireDisparaitrePageFormulaire() {
    var elmtSwipper = document.getElementById('swipper');
    var elmtListConteneur = document.getElementById('list-container');
    var btnAjouter = document.getElementById('img-ajouter');
    var btnRetour = document.getElementById('img-retour');
    var elmtAjoutConteneur = document.getElementById('ajout-container');

    elmtSwipper.classList.remove('hide');
    elmtListConteneur.classList.remove('hide');
    btnAjouter.classList.remove('hide');
    btnRetour.classList.remove('show');
    elmtAjoutConteneur.classList.remove('show');
    viderFormulaire();
}

/** ----- CONTROLE DE SAISIE DU FORMULAIRE ------ */
function controleSaisie(objetVignette) {
    if (objetVignette.nom && 
        objetVignette.prenom && 
        objetVignette.jour &&
        objetVignette.jour >= 1 &&
        objetVignette.jour <= 31 &&
        objetVignette.mois &&
        objetVignette.mois >= 1 &&
        objetVignette.mois <= 12 &&
        objetVignette.annee &&
        objetVignette.annee > 1900 &&
        objetVignette.annee <= new Date().getFullYear()) {

        objetVignette.jour = ('0' + objetVignette.jour).slice(-2);
        objetVignette.mois = ('0' + objetVignette.mois).slice(-2);
        return true
    }
    else {
        return false;
    }
}

/** ----- VIDE LE FORMULAIRE ------ */
function viderFormulaire() {
    var elmtFormulaire = document.getElementById('formulaire-container');
    elmtFormulaire.reset();
}

/** ----- Réinitialise le swipper ------ */
function reinitialiserSwipper() {
    var elmtGateau = document.getElementById("gateau");
    var elmtAstro = document.getElementById("astro");
    var elmtAstroChinois = document.getElementById("astrochinois");
    var elmtsAge = document.getElementsByClassName('age');
    var elmtsAstro = document.getElementsByClassName('astro-normal');
    var elmtsAstroChinois = document.getElementsByClassName('astro-chinois');

    elmtGateau.classList.remove('active');
    elmtAstro.classList.remove('active');
    elmtAstroChinois.classList.remove('active');
    elmtGateau.classList.add('active');

    for (let elmt of elmtsAge) {
        elmt.classList.remove('active');
        elmt.classList.add('active');
    }
    for (let elmt of elmtsAstro) {
        elmt.classList.remove('active');
    }
    for (let elmt of elmtsAstroChinois) {
        elmt.classList.remove('active');
    }
} 

/** ----- AJOUT DE LA NOUVELLE VIGNETTE DANS LE LOCAL STORAGE ------ */
function ajoutLocal(objetVignette) {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    // suppression de la donnée si elle existe
    if (storage) {
        storage.forEach( (elmt, id) => {
            if (elmt.index == objetVignette.index) {
                storage.splice(id, 1);
            }
        })
    }
    else {
        storage = [];
    }
    storage.push(objetVignette);
    localStorage.setItem("vignettes", JSON.stringify(storage));
}

//** -----CONSTRUIT UN ELEMENT HTML----- */
function creerElement(type, id, classes, content, attribut) {
    var newElmt = document.createElement(type);
    if (id !== 0) {
        newElmt.id = id;
    }
    if (classes !== '') {
        newElmt.className = classes;
    }
    if (content !== undefined) {
        var newContent = document.createTextNode(content);
        newElmt.appendChild(newContent);
    }
    if (attribut !== undefined) {
        newElmt.setAttribute('onclick', attribut);
    }

    return newElmt;
}

//** -----CALCUL ANNEE BISSEXTILE----- */
function isAnneeBissextile() {
    var cetteAnnee = new Date().getUTCFullYear();
    return (cetteAnnee % 100 === 0) ? (cetteAnnee % 400 === 0) : (cetteAnnee % 4 === 0);
}

//** -----CALCUL TEMPS RESTANT JUSQU'A ANNIVERSAIRE----- */
function calculTempsRestant(jour, mois) {
    var cetteAnnee = new Date().getUTCFullYear();
    var dateAnniv = new Date(cetteAnnee, mois - 1, jour);
    var diff = dateAnniv.getTime() - Date.now();
    if (diff > -86400000 && diff < 0) {
        return "aujourd'hui";
    }
    else if (diff > 0 && diff < 86400000) {
        return "demain";
    }
    else if (diff < -86400000) {
        dateAnniv = new Date(cetteAnnee + 1, mois - 1, jour);
        diff = dateAnniv.getTime() - Date.now();
    }
    var joursRestant = Math.floor(diff / (1000*60*60*24)) + 1;
    var moisRestant = Math.floor(joursRestant / 30.4) + 1;
    var ceMois = new Date().getMonth() + 1;

    if (((ceMois === 1 || ceMois === 3 || ceMois === 5 || 
        ceMois === 7 || ceMois === 8 || ceMois === 10 || 
        ceMois === 12) && (joursRestant <= 31))
        || 
        ((ceMois === 4 || ceMois === 6 || ceMois === 9 || 
            ceMois === 11) && (joursRestant <= 30))) {
        return 'dans ' + joursRestant + (joursRestant === 1 ? ' jour' : ' jours');
    }
    else if (ceMois === 2 && isAnneeBissextile && joursRestant <= 29) {
        return 'dans ' + joursRestant + (joursRestant === 1 ? ' jour' : ' jours');
    }
    else if (ceMois === 2 && !isAnneeBissextile && joursRestant <= 28) {
        return 'dans ' + joursRestant + (joursRestant === 1 ? ' jour' : ' jours');
    }
    else {
        return 'dans ' + moisRestant + ' mois';
    }
}

//** -----CALCUL AGE----- */
function calculAge(jour, mois, annee) {
    var date = new Date(annee, mois - 1, jour);
    var dateToday = new Date(new Date().getUTCFullYear(), new Date().getMonth(), new Date().getDate());
    var diff = dateToday.getTime() - date.getTime();
    var age = Math.floor(diff/(1000*60*60*24*365.27));
    return age;
}

//** -----CALCUL ZODIAC----- */
function calculZodiac(jour, mois) {
    var indexSigne = 0;
    if(jour <= LIMITES_SIGNES_ASTRO[mois - 1]) {
        indexSigne = mois - 1;
    }
    else {
        indexSigne = mois % 12;
    }
    return SIGNES_ASTRO[indexSigne];
}

//** -----CALCUL ZODIAC CHINOIS----- */
function calculZodiacChinois(annee) {
    var anneeRef = 1900;
    var index = (annee - anneeRef) % 12;
    return SIGNES_CHINOIS[index];
}

//** -----CONSTRUIT VIGNETTE HTML PUIS LA RAJOUTE AU DOM----- */
function constructionVignetteHTML(nom, prenom, jour, mois, annee, index) {
    var elmtListConteneur = document.getElementById('liste');
    var date = "" + jour  + "/" + mois + "/" + annee;
    var nom_prenom = "" + prenom + " " + nom;
    var futurAge = calculAge(jour, mois, annee) + 1;
    var ans = futurAge > 1 ? ' ANS' : ' AN';
    var tempsRestant = calculTempsRestant(jour, mois);
    var zodiac = calculZodiac(jour, mois);
    var zodiacChinois = calculZodiacChinois(annee);
    var elmtVignetteConteneur = creerElement('a', 0, 'vignette-container');
    var elmtVignette = creerElement('a', 0, 'vignette-principal', undefined, 'clickAccordeon(this)');
    var elmtProfil = creerElement('div', 0, 'profil');
    var elmtNom = creerElement('div', 0, 'nom-prenom', nom_prenom);
    var elmtdate = creerElement('div', 0, 'date-naissance', date);
    var elmtCaracteristiques = creerElement('div', 0, 'caracteristique');
    var elmtAge = creerElement('div', 0, 'age active', futurAge);
    var spanAge = creerElement('span', 0, '', ans);
    var elmtTps = creerElement('div', 0, 'age active temps-restant', tempsRestant);
    var elmtAstroNormal = creerElement('div', 0, 'astro-normal', zodiac);
    var elmtAstroChinois = creerElement('div', 0, 'astro-chinois', zodiacChinois);
    var elmtAccordeon = creerElement('div', 0, 'accordeon-content');
    var elmtSuppr = creerElement('a', 'suppr-' + index, 'btn-suppr', undefined, 'clickSuppr(this)');
    var elmtImgSuppr = creerElement('div', 0, 'img-suppr');
    var elmtTextSuppr = creerElement('div', 0, 'supprimer', 'Supprimer');
    var elmtModif = creerElement('a', 'modif-' + index, 'btn-modif', undefined, 'clickModif(this)');
    var elmtImgModif = creerElement('div', 0, 'img-modif');
    var elmtTextModif = creerElement('div', 0, 'modifier', 'Modifier');

    elmtProfil.appendChild(elmtNom);
    elmtProfil.appendChild(elmtdate);
    elmtAge.appendChild(spanAge);
    elmtCaracteristiques.appendChild(elmtAge);
    elmtCaracteristiques.appendChild(elmtTps);
    elmtCaracteristiques.appendChild(elmtAstroNormal);
    elmtCaracteristiques.appendChild(elmtAstroChinois);
    elmtVignette.appendChild(elmtProfil);
    elmtVignette.appendChild(elmtCaracteristiques);
    elmtModif.appendChild(elmtImgModif);
    elmtModif.appendChild(elmtTextModif);
    elmtSuppr.appendChild(elmtImgSuppr);
    elmtSuppr.appendChild(elmtTextSuppr);
    elmtAccordeon.appendChild(elmtSuppr);
    elmtAccordeon.appendChild(elmtModif);
    elmtVignetteConteneur.appendChild(elmtVignette);
    elmtVignetteConteneur.appendChild(elmtAccordeon);
    elmtListConteneur.appendChild(elmtVignetteConteneur);
}

//** -----AJOUT DES VIGNETTES AU HTML----- */
function ajoutVignettesHTML(donnees) {
    var nom = '';
    var prenom = '';
    var jour = 0;
    var mois = 0;
    var annee = 0;

    donnees.forEach(function(donnee) {
        nom = donnee.nom;
        prenom = donnee.prenom;
        jour = donnee.jour;
        mois = donnee.mois;
        annee = donnee.annee;
        index = donnee.index;
        constructionVignetteHTML(nom, prenom, jour, mois, annee, index);
    })
}

//** -----MET LE TABLEAU DE DONNEES DANS L'ORDRE DES DATES (PROCHAIN ANNIV EN HAUT)----- */
function miseEnOrdre(storage) {
    var tableauOrdre = [];
    var tableauAvantDate = [];
    var tableauApresDate = [];
    var jourToday = new Date().getDate();
    var moisToday = new Date().getMonth() + 1;

    storage.sort((a, b) => {
        return (a.mois * 100 + a.jour) - (b.mois * 100 + b.jour) ;
    });

    storage.forEach( elmt => {
        if ((moisToday * 100 + jourToday) <= (elmt.mois + elmt.jour)) {
            tableauAvantDate.push(elmt);
        }
        else {
            tableauApresDate.push(elmt);
        }
    })

    tableauOrdre = tableauAvantDate.concat(tableauApresDate);

    return tableauOrdre;
}

//** -----SUPPRIME LA LISTE DE VIGNETTES DU DOM----- */
function suppressionElmtListeVignettes() {
    var elmtConteneur = document.getElementById('liste');
    while (elmtConteneur.lastElementChild) {
        elmtConteneur.removeChild(elmtConteneur.lastElementChild);
    }
}

//** -----AFFICHE LA PRESENTATION DE L'APPLI----- */
function gestionAffichagePresentation() {
    var elmtSwipper = document.getElementById('swipper');
    var elmtListConteneur = document.getElementById('list-container');
    var elmtFleche = document.getElementById('fleche-presentation');
    var elmtPresentation = document.getElementById('presentation-container');
    var btnParams = document.getElementById('img-params');

    if (!storage || storage.length == 0) {
        elmtSwipper.classList.add('hide');
        elmtListConteneur.classList.add('hide');
        elmtFleche.classList.remove('hide');
        elmtPresentation.classList.remove('hide');
        btnParams.classList.remove('show');
    }
    else {
        elmtFleche.classList.add('hide');
        elmtPresentation.classList.add('hide');
        btnParams.classList.add('show');
    }
}

//** -----SUPPRIME LES ANCIENNES VIGNETTES, RECUPERE LE LOCAL STORAGE, AFFICHE LES VIGNETTES----- */
function affichageLocal() {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    suppressionElmtListeVignettes();
    if (storage && storage.length !== 0) {
        storage = miseEnOrdre(storage);
        ajoutVignettesHTML(storage);
    }
}

//** -----AFFICHE LES MAJ S'IL Y EN A----- */
function gestionMiseAJour() {
    var miseAJourOld = JSON.parse(localStorage.getItem("maj"));
    if (miseAJourOld) {
        if(miseAJourOld.date !== miseAJour.date) {
            localStorage.setItem("maj", JSON.stringify(miseAJour));
            ouverturePopinMAJ(miseAJour);
        }
    }
    else {
        localStorage.setItem("maj", JSON.stringify(miseAJour));
    }
}

/** -----AU CHARGEMENT DU DOM----- */
function onDocumentReady() {
    affichageLocal();
    gestionAffichagePresentation();
    //getVersion();
    ajoutEvtDbleClickLogo();
    gestionMiseAJour();
}

/** -----AU CHARGEMENT DU DOM----- */
document.onload = onDocumentReady();
