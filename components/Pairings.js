var objTeam = {};
var pairingArray = [];
var colonnaOrdinata = 1;



export default async function Pairings() {
    var element = <table class="myTable" id="myTable">
    <tbody><tr class="header">
        <th id="titoloNumTav" onclick="sortTable(0)">Table</th>
        <th id="titoloNomeP1" onclick="sortTable(1)">Player 1 ▼</th>
        <th>Points</th>
        <th>Player 2</th>
        <th>Points</th>
    </tr>

    </tbody><tbody id="mioTable"></tbody></table>
    var html = await richiestaJson()
    element.getElementById('mioTable').innerHTML = html
    return element
}

//richiama json
async function richiestaJson() {
  const nomeJson = "https://whatsmytable.com/Paupergeddon/jsonFile/event.json?v=" + Date.now()
  const rispostaJson = await fetch(nomeJson)
  //const rispostaJson = await fetch("https://cors-anywhere.herokuapp.com/https://whatsmytable.com/jsonFile/event.json");
  const datiJson = await rispostaJson.json();
  // modificaTitolo(datiJson.data);
  arrayGiocatori(datiJson.data);
  generaPairings(datiJson.data);
  return stampaPairings(pairingArray);
}

function modificaTitolo(dati) {
  var titolo = document.getElementById('titolo')
  var titoloTorneo = dati.EventName;
  var roundAttuale = dati.CurrentRoundNumber;
  titolo.innerHTML = titoloTorneo + ' - Round ' + roundAttuale;
}

function arrayGiocatori(dati) {
  var giocatori = {};
  for (var i = 0; i < dati.Persons.length; i++) {
    giocatori[dati.Persons[i]._id] = dati.Persons[i].LastName + ' ' + dati.Persons[i].FirstName;
  }
  for (var i = 0; i < dati.Teams.length; i++) {
    var idTeam = dati.Teams[i]._id;
    objTeam[idTeam] = dati.Teams[i];
    objTeam[idTeam].PlayerName = giocatori[objTeam[idTeam].Players[0]];    
  }
}


function generaPairings(dati) {
  var roundAttuale = dati.CurrentRoundNumber;

  for (var incontro of dati.MatchingTables) {
    if (incontro.RoundNumber != roundAttuale) {
      continue;
    }
    
    if (incontro.GameByes1 == 1) {
      var row = {'table':'0','player1':objTeam[incontro.Team1].PlayerName,'puntiPlayer1':objTeam[incontro.Team1].MatchPoints,'player2':'BYE','puntiPlayer2':'-'};
      pairingArray.push(row);
      continue;      
    }

    if (incontro.Player1 == null) {
      var row = {'table':'0','player1':objTeam[incontro.Team1].PlayerName,'puntiPlayer1':objTeam[incontro.Team1].MatchPoints,'player2':'LOSS','puntiPlayer2':'-'};
      pairingArray.push(row);
      continue;
    }

    var row = {'table':incontro.Number,'player1':objTeam[incontro.Team1].PlayerName,'puntiPlayer1':objTeam[incontro.Team1].MatchPoints,'player2':objTeam[incontro.Team2].PlayerName,'puntiPlayer2':objTeam[incontro.Team2].MatchPoints};
    pairingArray.push(row);

    var row = {'table':incontro.Number,'player1':objTeam[incontro.Team2].PlayerName,'puntiPlayer1':objTeam[incontro.Team2].MatchPoints,'player2':objTeam[incontro.Team1].PlayerName,'puntiPlayer2':objTeam[incontro.Team1].MatchPoints};
    pairingArray.push(row);
  }
  pairingArray = pairingArray.sort(function(a, b) {
    var nameA = a.player1.toUpperCase(); // ignore upper and lowercase
    var nameB = b.player1.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}

function stampaPairings(data){
    var table = document.getElementById('mioTable');
    var contenutoTable = '';
    for (var i = 0; i < data.length; i++){
        var puntiP1 = data[i].puntiPlayer1;
        if (puntiP1 == undefined) {puntiP1 = 0};
        var puntiP2 = data[i].puntiPlayer1;
        if (puntiP2 == undefined) {puntiP1 = 0};
        var row = `<tr>
                        <td>${data[i].table}</td>
                        <td>${data[i].player1}</td>
                        <td>${puntiP1}</td>
                        <td>${data[i].player2}</td>
                        <td>${puntiP2}</td>
                  </tr>`
        contenutoTable += row;
    }
    return contenutoTable
}

function sortTable(colonna){//da migliorare per qualsiasi numero di colonne
  if (colonna != colonnaOrdinata) {
    colonnaOrdinata = colonna;
    var titoloTavolo = document.getElementById('titoloNumTav');
    var titoloGiocatore = document.getElementById('titoloNomeP1');
    var nuovoTitoloTavolo = '';
    var nuovoTitoloGiocatore = '';
    if (colonna == 0) {
      pairingArray = pairingArray.sort(function(a, b) {
        return a.table - b.table;
      });
      nuovoTitoloTavolo = 'Table &#9660';
      nuovoTitoloGiocatore = 'Player 1';
    }
    if (colonna == 1) {
      pairingArray = pairingArray.sort(function(a, b) {
        var nameA = a.player1.toUpperCase(); // ignore upper and lowercase
        var nameB = b.player1.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
    
        // names must be equal
        return 0;
      });
      nuovoTitoloTavolo = 'Table';
      nuovoTitoloGiocatore = 'Player 1 &#9660';
    }
  stampaPairings(pairingArray);
  titoloTavolo.innerHTML = nuovoTitoloTavolo;
  titoloGiocatore.innerHTML = nuovoTitoloGiocatore;
  }
}