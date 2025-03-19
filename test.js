// De valgte start- og slutby. Dette er undefined fra start af da der ikke er valgt noget
let startby = undefined;
let slutby = undefined;

// Bollean om vi er i gang med at vælge start- eller slutby
let vælgerStartby = false;
let vælgerSlutby = false;

// Afstand til slutbyen
let afstandTilSlut = undefined;

// Liste der holder styr på den korteste sti mellem start- og slutby
let sti = [];

// Radius for byernes cirkler
const radius = 68;

// Skalering af kortet
const scale = 1.09;

// Klasse der repræsenterer en by
class By {
  constructor(navn, x, y) {
    this.navn = navn;
    this.x = x;
    this.y = y;
  }

  draw() {
    stroke(0);
    strokeWeight(3);

    // Hvis byen er startby er den grøn, hvis den er slutby er den rød, ellers rød
    if (this.navn === startby?.navn) {
      fill("#32a852");
    } else if (this.navn === slutby?.navn) {
      fill("#a83232");
    } else {
      fill("white");
    }

    // Tegner byens cirkel
    circle(this.x, this.y, radius);

    // Navneskilt på byen
    fill(0);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.navn, this.x, this.y);
  }
}

// Klasse der repræsenterer en vej mellem to byer
class Vej {
  constructor(værdi, by1, by2) {
    this.værdi = værdi; // Tid mellem byer i minutter
    this.by1 = by1;
    this.by2 = by2;
  }

  draw() {
    // Hvis vejen er en del af den korteste sti, farves den blå
    if (sti.includes(this)) {
      stroke("blue");
    } else {
      stroke("black");
    }

    strokeWeight(5);
    line(this.by1.x, this.by1.y, this.by2.x, this.by2.y);

    // Viser afstanden mellem byerne
    const midX = (this.by1.x + this.by2.x) / 2;
    const midY = (this.by1.y + this.by2.y) / 2;

    strokeWeight(0);
    stroke(255);
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(this.værdi, midX, midY);
  }
}

// Instantiere byerne
const Aalborg = new By("Aalborg", 550, 80);
const Thisted = new By("Thisted", 210, 120);
const Randers = new By("Randers", 560, 350);
const Aarhus = new By("Aarhus", 600, 500);
const Ebeltoft = new By("Ebeltoft", 740, 480);
const Herning = new By("Herning", 280, 500);
const Esbjerg = new By("Esbjerg", 160, 780);
const Vejle = new By("Vejle", 430, 690);
const Odense = new By("Odense", 650, 840);
const SjællandsOdde = new By("Sjællands Odde", 910, 570);
const Slagelse = new By("Slagelse", 920, 840);
const Roskilde = new By("Roskilde", 1090, 740);
const København = new By("København", 1220, 710);

// Byerne samlet i en liste
const byer = [
  Aalborg,
  Thisted,
  Randers,
  Aarhus,
  Ebeltoft,
  Herning,
  Esbjerg,
  Vejle,
  Odense,
  SjællandsOdde,
  Slagelse,
  Roskilde,
  København,
];

// Liste over alle veje
const veje = [
  // Fra Aalborg
  new Vej(82, Aalborg, Thisted),
  new Vej(58, Aalborg, Randers),
  new Vej(110, Aalborg, Herning),
  // Fra Thisted
  new Vej(92, Thisted, Herning),
  new Vej(168, Thisted, Esbjerg),

  // Fra Randers
  new Vej(67, Randers, Herning),
  new Vej(39, Randers, Aarhus),
  new Vej(55, Randers, Ebeltoft),

  // Fra Aarhus
  new Vej(59, Aarhus, Vejle),
  new Vej(62, Aarhus, Herning),
  new Vej(68, Aarhus, SjællandsOdde),

  // Fra Herning
  new Vej(78, Herning, Esbjerg),
  new Vej(46, Herning, Vejle),

  // Fra Vejle
  new Vej(65, Vejle, Esbjerg),
  new Vej(60, Vejle, Odense),

  // Fra Slagelse
  new Vej(55, Slagelse, Odense),
  new Vej(57, Slagelse, Roskilde),
  new Vej(71, Slagelse, SjællandsOdde),

  // Fra Roskilde
  new Vej(56, Roskilde, SjællandsOdde),
  new Vej(38, Roskilde, København),
];

// Loader billedet af Danmark ind
function preload() {
  kort = loadImage("images/kort.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  image(kort, 0, 0, kort.width * scale, kort.height * scale);

  // Tegner alle veje og byer
  for (const vej of veje) {
    vej.draw();
  }

  for (const by of byer) {
    by.draw();
  }

  // Opretter knapper for brugeren
  knapper();

  // Viser valgt startby, slutby og rute
  tekst();
 
  
}

// Funktion der opretter knapper for brugeren
function knapper() {
  // Position for knapperne
  let knapPositionX = kort.width * scale + 40;
  let knapPositionY = 700;

  // Vælge startby knap
  let startKnap = createButton("Vælg Startby");
  startKnap.position(knapPositionX, knapPositionY);
  startKnap.class("button-style");
  startKnap.mousePressed(() => {
    vælgerSlutby = false;
    vælgerStartby = true;
    sti = [];
  });

  // Nulstil knap for startby
  let nulstilStart = createButton("Nulstil");
  nulstilStart.position(knapPositionX + 230, knapPositionY);
  nulstilStart.class("button-style");
  nulstilStart.mousePressed(() => {
    startby = undefined;
    setup();
  });

  // Vælge slutby knap
  let slutKnap = createButton("Vælg Slutby");
  slutKnap.position(knapPositionX, knapPositionY + 70);
  slutKnap.class("button-style");
  slutKnap.mousePressed(() => {
    vælgerStartby = false;
    vælgerSlutby = true;
    sti = [];
  });

  // Nulstil knap for startby
  let nulstilSlut = createButton("Nulstil");
  nulstilSlut.position(knapPositionX + 230, knapPositionY + 70);
  nulstilSlut.class("button-style");
  nulstilSlut.mousePressed(() => {
    slutby = undefined;
    setup();
  });

  // Dijkstra knap
  let dijkstra = createButton("Dijkstra");
  dijkstra.position(knapPositionX, knapPositionY + 140);
  dijkstra.class("button-style");
  dijkstra.mousePressed(() => {
    dijkstra1(startby, slutby);
  });

  // Nulstil knap for Dijkstra
  let nulstilDijkstra = createButton("Nulstil");
  nulstilDijkstra.position(knapPositionX + 230, knapPositionY + 140);
  nulstilDijkstra.class("button-style");
  nulstilDijkstra.mousePressed(() => {
    sti = [];
    afstandTilSlut = undefined;
    setup();
  });

}

// Funktion der kaldes når musen klikkes
function mousePressed() {
  if (vælgerStartby) {
    for (const by of byer) {
      if (dist(mouseX, mouseY, by.x, by.y) < radius / 2) {
        startby = by;
        vælgerStartby = false;

        setup();
        break;
      }
    }
  }

  if (vælgerSlutby) {
    for (const by of byer) {
      if (dist(mouseX, mouseY, by.x, by.y) < radius / 2) {
        slutby = by;
        vælgerSlutby = false;
        setup();
        break;
      }
    }
  }
}

// Funktion til at vise valgte byer og korteste rute
function tekst() {
  // Position for teksten
  let tekstPositionX = kort.width * scale + 40;
  let tekstPositionY = 40;
  textSize(30);
  textAlign(LEFT);

  if (startby == undefined) {
    text("Startby: Ikke valgt", tekstPositionX, tekstPositionY);
  } else {
    text("Startby: " + startby.navn, tekstPositionX, tekstPositionY);
  }

  if (slutby == undefined) {
    text("Slutby: Ikke valgt", tekstPositionX, tekstPositionY + 50);
  } else {
    text("Slutby: " + slutby.navn, tekstPositionX, tekstPositionY + 50);
  }

  if (afstandTilSlut == undefined) {
    text("Afstand: Vælg rute", tekstPositionX, tekstPositionY + 100);
  } else {
    text("Afstand: " + afstandTilSlut, tekstPositionX, tekstPositionY + 100);
  }

  // Sørger for at ruten vises korrekt
  if (afstandTilSlut == undefined) {
    text("Rute: Vælg rute", tekstPositionX, tekstPositionY + 150);
  } else {
    text("Rute:", tekstPositionX, tekstPositionY + 150);
    let offset = 190;
    
    let byNavn = startby.navn;
    
    for (let i = sti.length - 1; i >= 0; i--) {
      let næsteByNavn = (sti[i].by1.navn === byNavn) ? sti[i].by2.navn : sti[i].by1.navn;
      
      text(byNavn + " -> " + næsteByNavn + " (" + sti[i].værdi + ")", tekstPositionX, tekstPositionY + offset);  
      
      byNavn = næsteByNavn;
      offset += 40;
    }
  }
}


// Implementering af Dijkstras algoritme
function dijkstra1(startby, slutby) {
  if (!startby || !slutby) {
    console.log("Startby og Slutby skal vælges først!");
    return;
  }

  let besøgte = [];
  let afstande = {};

  // Sætter afstand til alle byer til uendelig og startby til 0
  for (const by of byer) {
    afstande[by.navn] = { værdi: Infinity, forrige: null };
  }
  afstande[startby.navn] = { værdi: 0, forrige: null };

  let nuværendeBy = startby;

  while (besøgte.length < byer.length) {
    // Finder byen med mindste afstand og sætter den til nuværendeBy
    let mindsteAfstand = Infinity;
    for (let afstand in afstande) {
      if (afstande[afstand].værdi < mindsteAfstand && !besøgte.includes(afstand)) {
        mindsteAfstand = afstande[afstand].værdi;
        for (let by of byer) {
          if (by.navn === afstand) {
            nuværendeBy = by;
          }
        }
      }
    }

    // Opdaterer afstande til nabobyer
    let muligeVeje = findMuligeVeje(veje, nuværendeBy.navn);
    for (let vej of muligeVeje) {
      if (
        vej.by1.navn === nuværendeBy.navn &&
        vej.værdi + afstande[nuværendeBy.navn].værdi < afstande[vej.by2.navn].værdi
      ) {
        afstande[vej.by2.navn].værdi = vej.værdi + afstande[nuværendeBy.navn].værdi;
        afstande[vej.by2.navn].forrige = nuværendeBy;
      } else if (
        vej.by2.navn === nuværendeBy.navn &&
        vej.værdi + afstande[nuværendeBy.navn].værdi < afstande[vej.by1.navn].værdi
      ) {
        afstande[vej.by1.navn].værdi = vej.værdi + afstande[nuværendeBy.navn].værdi;
        afstande[vej.by1.navn].forrige = nuværendeBy;
      }
    }

    // Tilføjer nuværendeBy til besøgte
    besøgte.push(nuværendeBy.navn);
  }
  // Tegner den korteste vej
  tegnKortesteVej(afstande, startby, slutby);
}
// Finder alle mulige veje fra en by
function findMuligeVeje(veje, byNavn) {
  //by er en string, veje er en liste over alle veje
  let muligeveje = [];
  for (let index = 0; index < veje.length; index++) {
    const by1 = veje[index].by1.navn;
    const by2 = veje[index].by2.navn;
    if (by1 === byNavn || by2 === byNavn) {
      muligeveje.push(veje[index]);
    }
  }
  return muligeveje;
}

// Funktion til at tegne den korteste vej fra Dijkstra
function tegnKortesteVej(afstande, startby, slutby) {
  let nuværendeBy = slutby;
  sti = [];
  afstandTilSlut = afstande[slutby.navn].værdi;

  while (nuværendeBy.navn !== startby.navn) {
    for (let vej of veje) {
      if (vej.by1.navn === nuværendeBy.navn && afstande[nuværendeBy.navn].forrige === vej.by2) {
        sti.push(vej);
        nuværendeBy = vej.by2;
        break;
      } else if (
        vej.by2.navn === nuværendeBy.navn &&
        afstande[nuværendeBy.navn].forrige === vej.by1
      ) {
        sti.push(vej);
        nuværendeBy = vej.by1;
        break;
      }
    }
  }

  setup();
}
