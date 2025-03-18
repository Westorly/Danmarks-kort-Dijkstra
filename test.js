//De valgte start- og slutby. Dette er null fra start af da der ikke er valgt noget
let startby = undefined;
let slutby = undefined;

//Bollean om vi er i gang med at vælge start eller slutby
let vælgerStartby = false;
let vælgerSlutby = false;

let afstandTilSlut = undefined;

let sti = [];


//radius for byerne
const radius = 68;

//skalering af kortet
const scale = 1.09;

//Skabelon af by
class By {
  constructor(navn, x, y) {
    this.navn = navn;
    this.x = x;
    this.y = y;
  }

  draw() {
    stroke(0);
    strokeWeight(3);

    //Hvis byen er startby er den grøn og hvis den er slutby er den rød
    if (this.navn === startby?.navn) {
      fill("#32a852");
    } else if (this.navn === slutby?.navn) {
      fill("#a83232");
    } else {
      fill("white");
    }

    circle(this.x, this.y, radius);

    //Navneskilt
    fill(0);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.navn, this.x, this.y);
  }
}

class Vej {
  constructor(værdi, by1, by2) {
    this.værdi = værdi;
    this.by1 = by1;
    this.by2 = by2;
  }

  draw() {
    if (sti.includes(this)) {
      stroke("blue");
    } else {
      stroke("black");
    }

    strokeWeight(5);
    line(this.by1.x, this.by1.y, this.by2.x, this.by2.y);

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

//Byer eller vertices
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

//By veje eller edges
const veje = [
  //Fra Aalborg
  new Vej(82, Aalborg, Thisted),
  new Vej(58, Aalborg, Randers),
  new Vej(110, Aalborg, Herning),
  //Fra Thisted
  new Vej(92, Thisted, Herning),
  new Vej(168, Thisted, Esbjerg),

  //Fra Randers
  new Vej(67, Randers, Herning),
  new Vej(39, Randers, Aarhus),
  new Vej(55, Randers, Ebeltoft),

  //Fra Aarhus
  new Vej(59, Aarhus, Vejle),
  new Vej(62, Aarhus, Herning),
  new Vej(68, Aarhus, SjællandsOdde),

  //Fra Herning
  new Vej(78, Herning, Esbjerg),
  new Vej(46, Herning, Vejle),

  //Fra Vejle
  new Vej(65, Vejle, Esbjerg),
  new Vej(60, Vejle, Odense),

  //Fra Slagelse
  new Vej(55, Slagelse, Odense),
  new Vej(57, Slagelse, Roskilde),
  new Vej(71, Slagelse, SjællandsOdde),

  //Fra Roskilde
  new Vej(56, Roskilde, SjællandsOdde),
  new Vej(38, Roskilde, København),
];

function preload() {
  kort = loadImage("images/kort.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  image(kort, 0, 0, kort.width * scale, kort.height * scale);

  for (const vej of veje) {
    vej.draw();
  }

  for (const by of byer) {
    by.draw();
  }

  //Knapper for brugeren
  knapper();

  //Tekst for valgte start- og slutby
  
  let rute = sti.reverse()
  console.log(rute)
  tekst(rute);
 
  
}

function knapper() {
  let knapPositionX = kort.width * scale + 40;
  let knapPositionY = 700;

  let startKnap = createButton("Vælg Startby");
  startKnap.position(knapPositionX, knapPositionY);
  startKnap.class("button-style");
  startKnap.mousePressed(() => {
    vælgerSlutby = false;
    vælgerStartby = true;
    sti = [];
  });

  let nulstilStart = createButton("Nulstil");
  nulstilStart.position(knapPositionX + 230, knapPositionY);
  nulstilStart.class("button-style");
  nulstilStart.mousePressed(() => {
    startby = undefined;
    setup();
  });

  let slutKnap = createButton("Vælg Slutby");
  slutKnap.position(knapPositionX, knapPositionY + 70);
  slutKnap.class("button-style");
  slutKnap.mousePressed(() => {
    vælgerStartby = false;
    vælgerSlutby = true;
    sti = [];
  });

  let nulstilSlut = createButton("Nulstil");
  nulstilSlut.position(knapPositionX + 230, knapPositionY + 70);
  nulstilSlut.class("button-style");
  nulstilSlut.mousePressed(() => {
    slutby = undefined;
    setup();
  });

  let dijkstra = createButton("Dijkstra");
  dijkstra.position(knapPositionX, knapPositionY + 140);
  dijkstra.class("button-style");
  dijkstra.mousePressed(() => {
    dijkstra1(startby, slutby);
  });

  let nulstilDijkstra = createButton("Nulstil");
  nulstilDijkstra.position(knapPositionX + 230, knapPositionY + 140);
  nulstilDijkstra.class("button-style");
  nulstilDijkstra.mousePressed(() => {
    sti = [];
    afstandTilSlut = undefined;
    setup();
  });

}

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

function tekst(rute) {
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

  if (afstandTilSlut == undefined) {
    text("Rute: Vælg rute", tekstPositionX, tekstPositionY + 150);
  } else {
    text("Rute:", tekstPositionX, tekstPositionY + 150);
    let offset = 190;

    for (let i = rute.length - 1; i >= 0; i--) {
      let by1navn = rute[i].by1.navn;
      let by2navn = i + 1 < rute.length ? rute[i + 1].by1.navn : rute[i].by2.navn;

      text(by1navn + " -> " + by2navn, tekstPositionX, tekstPositionY + offset);

      offset += 40; // Flytter teksten nedad for hver linje
    }
  }
}

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

function tegnKortesteVej(afstande, startby, slutby) {
  let nuværendeBy = slutby;
  sti = [];
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
