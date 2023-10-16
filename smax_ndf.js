



// Fonction asynchrone que vous souhaitez appeler
function fonctionAsynchrone() {
    return new Promise(function(resolve, reject) {
        // Votre code asynchrone ici



 
        // Créer une fenêtre contextuelle
        var popup = window.open('', '_blank', 'width=800,height=600');

        // Fonction pour créer une nouvelle table de dépenses
        function creerTableauDepenses() {
            var tableId = 'tableauDepenses';
            if (!popup.tableauExiste) {
                var contenuTable = `
                    <h2>Dépenses</h2>
					<style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            margin-bottom: 20px;
                        }

                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }

                        th {
                            background-color: #f2f2f2;
                        }

                        form, h2 {
                            margin-bottom: 20px;
                        }
                    </style>
                    <table id="${tableId}">
                        <tr>
                            <th>SEQ</th>
                            <th>Date</th>
                            <th>Nombre de Kilomètres</th>
                            <th>Ville de départ</th>
                            <th>Ville d'arrivée</th>
                            <th>Motorisation</th>
                            <th>Taux</th>
                        </tr>
                    </table><br>
					<input type="button" value="Soumettre Dépenses" onclick="soumettreDepenses()">
                `;
                popup.document.write(contenuTable);
                popup.tableauExiste = true;
            }

            return tableId;
        }

        // Construire le formulaire avec le tableau dans la fenêtre contextuelle
        var contenuPage = `
            <h2>Formulaire de Dépenses</h2>
            <form id="monFormulaire">
                
                <label for="date">Date:</label>
                <input type="date" name="date" max="${new Date().toISOString().split('T')[0]}"><br>

                <label for="kilometres">Nombre de Kilomètres:</label>
                <input type="number" name="kilometres" step="1"><br>

                <label for="villeDepart">Ville de départ:</label>
                <input type="text" name="villeDepart"><br>

                <label for="villeArrivee">Ville d'arrivée:</label>
                <input type="text" name="villeArrivee"><br>

                <label for="motorisation">Motorisation:</label>
                <select name="motorisation">
                    <option value="diesel">Diesel</option>
                    <option value="essence">Essence</option>
                    <option value="hybride">Hybride</option>
                </select><br>

                <label for="taux">Taux:</label>
                <select name="taux">
                    <option value="0.529">0,529</option>
                    <option value="0.606">0,606</option>
                    <option value="0.636">0,636</option>
                </select><br>

                <input type="button" value="Ajouter Dépense" onclick="ajouterDepense()">
            </form>
            <h2>Résultats</h2>
            <p id="totalKM">Total KM: 0</p>
            <p id="montantRegler">Montant à régler: 0.00</p>
        `;

        popup.document.write(contenuPage);

        // Fonction pour ajouter une dépense au tableau
        popup.ajouterDepense = function() {
            var formulaire = popup.document.getElementById('monFormulaire');
            var tableauId = creerTableauDepenses();
            var tableau = popup.document.getElementById(tableauId);
            
            // Récupérer les valeurs du formulaire
          //  var description = formulaire.elements.namedItem('description').value;
            var date = formulaire.elements.namedItem('date').value;
            var kilometres = formulaire.elements.namedItem('kilometres').value;
            var villeDepart = formulaire.elements.namedItem('villeDepart').value;
            var villeArrivee = formulaire.elements.namedItem('villeArrivee').value;
            var motorisation = formulaire.elements.namedItem('motorisation').value;
            var taux = formulaire.elements.namedItem('taux').value;

            // Ajouter une nouvelle ligne au tableau
            var nouvelleLigne = tableau.insertRow(-1);
            var cell1 = nouvelleLigne.insertCell(0);
            var cell2 = nouvelleLigne.insertCell(1);
            var cell3 = nouvelleLigne.insertCell(2);
            var cell4 = nouvelleLigne.insertCell(3);
            var cell5 = nouvelleLigne.insertCell(4);
            var cell6 = nouvelleLigne.insertCell(5);
            var cell7 = nouvelleLigne.insertCell(6);
           // var cell8 = nouvelleLigne.insertCell(7);

            // Remplir la nouvelle ligne avec les données du formulaire
            cell1.innerHTML = tableau.rows.length - 1; // SEQ (Auto increment)
         //   cell2.innerHTML = description;
            cell2.innerHTML = date;
            cell3.innerHTML = kilometres;
            cell4.innerHTML = villeDepart;
            cell5.innerHTML = villeArrivee;
            cell6.innerHTML = motorisation;
            cell7.innerHTML = taux;

            // Effacer les valeurs du formulaire après ajout
            formulaire.reset();

            // Mettre à jour le total des kilomètres
            mettreAJourTotalKM();
        };

        // Fonction pour mettre à jour le total des kilomètres
        function mettreAJourTotalKM() {
            var totalKM = 0;

            // Pour chaque ligne du tableau de dépenses
            for (var i = 1; i < popup.tableauDepenses.rows.length; i++) {
                var celluleKM = popup.tableauDepenses.rows[i].cells[3];
                var km = parseInt(celluleKM.innerHTML);
                if (!isNaN(km)) {
                    totalKM += km;
                }
            }

            // Afficher le total des kilomètres
            var totalKMElement = popup.document.getElementById('totalKM');
            totalKMElement.innerHTML = 'Total KM: ' + totalKM;

            // Calculer et afficher le montant à régler
            var tauxSelectionne = parseFloat(formulaire.elements.namedItem('taux').value);
            var montantRegler = totalKM * tauxSelectionne;
            var montantReglerElement = popup.document.getElementById('montantRegler');
            montantReglerElement.innerHTML = 'Montant à régler: ' + montantRegler.toFixed(2);
        }

       // Fonction pour soumettre les dépenses à la page principale
        popup.soumettreDepenses = function() {
            // Récupérer le tableau de dépenses
            var tableau = popup.document.getElementById('tableauDepenses');
            var lignes = tableau.getElementsByTagName('tr');
            var depenses = [];

            // Ignorer la première ligne (en-têtes)
            for (var i = 1; i < lignes.length; i++) {
                var cells = lignes[i].getElementsByTagName('td');
                var depense = {
                    //description: cells[0].innerText,
                    date: cells[1].innerText,
                    kilometres: cells[2].innerText,
                    typeCarburant: cells[3].innerText
                };
                depenses.push(depense);
            }

    // Stocker le code HTML de la table dans le champ texte
    var codeHTMLTableauDepenses = '<table border="1">';
    for (var i = 0; i < depenses.length; i++) {
        codeHTMLTableauDepenses += '<tr>';
        codeHTMLTableauDepenses += `<td>${depenses[i].seq}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].description}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].date}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].kilometres}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].villeDepart}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].villeArrivee}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].motorisation}</td>`;
        codeHTMLTableauDepenses += `<td>${depenses[i].taux}</td>`;
        codeHTMLTableauDepenses += '</tr>';
    }
    codeHTMLTableauDepenses += '</table>';

    // Stocker le code HTML dans le champ texte
    // champCodeHTML.value = codeHTMLTableauDepenses;
    
// Accéder à la page principale et mettre à jour le champ
window.opener.document.getElementById('smax-basic-form-0-Description').innerHTML='OK OK OK !!!';

            // Fermer la fenêtre contextuelle
           setTimeout(function() {
        popup.close();
    }, 500);

            // Afficher les données sur la page principale (vous pouvez ajuster cette partie selon vos besoins)
            //alert(JSON.stringify(depenses));
			//alert(codeHTMLTableauDepenses);
			//document.getElementById('smax-basic-form-0-Description').innerHTML=codeHTMLTableauDepenses;
        };
    
    







        // Par exemple, une simulation d'attente de 2 secondes
        setTimeout(function() {
            console.log("La fonction asynchrone est terminée.");
            resolve();  // Appel de resolve() pour indiquer que la fonction est terminée avec succès
        }, 2000);
    });
}

// Utilisation de la fonction asynchrone
async function utiliserFonctionAsynchrone() {
    console.log("Début de l'exécution du code.");

    // Appel de la fonction asynchrone et attendre qu'elle soit terminée
    await fonctionAsynchrone();

    console.log("Suite du code après l'exécution de la fonction asynchrone.");
}

// Appeler la fonction qui utilise la fonction asynchrone
//utiliserFonctionAsynchrone();
