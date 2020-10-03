/** ----- VALUES ------ */
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

//** -----OUVERTURE POPIN----- */
function ouverturePopin(prenom) {
    var titre = 'SUPPRESSION';
    var corps = 'Etes-vous sûr de vouloir supprimer ' + prenom + ' ?';
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
    ouverturePopin(prenom);
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
    var index = element.id.substr(6,1);
    remplirFormulaire(index);  
    faireApparaitrePageFormulaire();

    //TODO a supprimer (en test)
    //calculTempsJusquAAnniv(26, 9, 2020, 17);

}

/** ----- AU CLIC SUR AJOUTER UNE VIGNETTE ------ */
function clickAjout() {
    
    // affichage de l'ajout sur page accueil
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

/** ----- AU CLIC SUR VALIDATION POPIN SUPPRESSION ------ */
function clickOKPopin() {
    var valueIndex = document.getElementById('index-popin').value;
    supprimerDonneeStorage(valueIndex);
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

//** -----CALCUL AGE----- */
function calculAge(jour, mois, annee) {
    var date = new Date(annee, mois, jour);
    var diff = Date.now() - date.getTime();
    var age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
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
    var elmtListConteneur = document.getElementById('list-container');
    var date = "" + jour  + "/" + mois + "/" + annee;
    var nom_prenom = "" + prenom + " " + nom;
    var futurAge = calculAge(jour, mois, annee) + 1;
    var ans = futurAge > 1 ? ' ANS' : ' AN';
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
    var elmtConteneur = document.getElementById('list-container');
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

    if (!storage || storage.length == 0) {
        elmtSwipper.classList.add('hide');
        elmtListConteneur.classList.add('hide');
        elmtFleche.classList.remove('hide');
        elmtPresentation.classList.remove('hide');
    }
    else {
        elmtFleche.classList.add('hide');
        elmtPresentation.classList.add('hide');
    }
}

//** -----SUPPRIME LES ANCIENNES VIGNETTES, RECUPERE LE LOCAL STORAGE, AFFICHE LES VIGNETTES----- */
function affichageLocal() {
    storage = JSON.parse(localStorage.getItem("vignettes"));
    suppressionElmtListeVignettes();
    if (storage) {
        storage = miseEnOrdre(storage);
        ajoutVignettesHTML(storage);
    }
}

/** ----- CALCUL DE LA HAUTEUR POUR LE SCROLL DU LIST-CONTAINER ------ */
function calculHauteurs() {
    var hauteurEcran = screen.height;
    var hauteurHeader = document.getElementsByTagName('header')[0].offsetHeight;
    var hauteurSwipper = document.getElementById('swipper').offsetHeight;

    var hauteurListe = hauteurEcran - (hauteurHeader + hauteurSwipper);
    var hauteurFormulaire = hauteurEcran - hauteurHeader;
    var elmtListConteneur = document.getElementById('list-container');
    var elmtFormulaire = document.getElementById('ajout-container');
    var elmtPresentation = document.getElementById('presentation-container');
    elmtListConteneur.style.height = hauteurListe + 'px';
    elmtFormulaire.style.height = hauteurFormulaire + 'px';
    elmtPresentation.style.height = hauteurFormulaire + 'px';
}

/** -----AU CHARGEMENT DU DOM----- */
function onDocumentReady() {
    calculHauteurs();
    affichageLocal();
    gestionAffichagePresentation();
}


/** -----AU CHARGEMENT DU DOM----- */
document.onload = onDocumentReady();
