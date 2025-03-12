let startby = null;
let slutby = null;
let vælgerStartby = false;
let vælgerSlutby = false;



const radius = 68;
const scale = 1.09;

class By{
  constructor(navn, x, y){
    this.navn = navn;
    this.x = x;
    this.y = y;
  }

  draw(){


    stroke(0)
    strokeWeight(3)

    if (this.navn === startby){
      fill('#32a852')
    }
    else if(this.navn === slutby){
      fill('#a83232')
    }
    else{
      fill('white')
    }
    
    circle(this.x, this.y, radius);

    //Navneskilt
    fill(0)
    strokeWeight(0)
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.navn, this.x, this.y);
 

    
  }
}  


class Vej{
  constructor(værdi, by1, by2){
    this.værdi = værdi;
    this.by1 = by1;
    this.by2 = by2;
  }

  

  draw(){
    if (sti.includes(this)){
      stroke('blue')
      
    } else{
      stroke('black')
    }

    
    strokeWeight(5);
    line(this.by1.x, this.by1.y, this.by2.x, this.by2.y);

    const midX = (this.by1.x + this.by2.x) / 2;
    const midY = (this.by1.y + this.by2.y) / 2;

    strokeWeight(0)
    stroke(255)
    fill(255)
    textSize(30);
    textAlign(CENTER, CENTER);
    text(this.værdi, midX, midY)

    

       

  }

  

}

//Byer
const Aalborg = new By("Aalborg", 550, 80);
const Thisted = new By("Thisted", 210, 120);
const Randers = new By("Randers", 560, 350);
const Aarhus = new By("Aarhus", 600, 500);
const Ebeltoft = new By("Ebeltoft", 740, 480);
const Herning = new By("Herning", 280, 500);

const Esbjerg = new By("Esbjerg", 160, 780);
const Vejle = new By("Vejle", 430, 690);
const Odense = new By("Odense", 650, 840);
const SjællandsOdde = new By("Sjællands\nOdde", 910, 570);
const Slagelse = new By("Slagelse", 920, 840);
const Roskilde = new By("Roskilde", 1090, 740);
const København = new By("København", 1220, 710)

const byer = [
  Aalborg, Thisted, Randers, Aarhus, Ebeltoft, 
  Herning, Esbjerg, Vejle, Odense, 
  SjællandsOdde, Slagelse, Roskilde, København
];

//Stier
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



function preload(){
  kort = loadImage("images/kort.png")
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  image(kort, 0, 0, kort.width * scale, kort.height * scale) 

  
  for (const vej of veje){
    vej.draw();
    
    
  }
  
  for (const by of byer){
    by.draw();
  }
  
  
  //Knapper
  knapper()

  tekst()
  

};



function knapper() {
  let knapPositionX = kort.width * scale + 40
  let knapPositionY = 300

  let startKnap = createButton('Vælg Startby');
  startKnap.position(knapPositionX, knapPositionY);
  startKnap.class('button-style');
  startKnap.mousePressed(() => {
    vælgerSlutby = false;
    vælgerStartby = true;
    
  }); 

  let nulstilStart = createButton('Nulstil');
  nulstilStart.position(knapPositionX + 230, knapPositionY);
  nulstilStart.class('button-style');
  nulstilStart.mousePressed(() => {
    startby = null;
    setup();
  });

  let slutKnap = createButton('Vælg Slutby');
  slutKnap.position(knapPositionX, knapPositionY + 70);
  slutKnap.class('button-style');
  slutKnap.mousePressed(() => {
    vælgerStartby = false; 
    vælgerSlutby = true;

  });


  let nulstilSlut = createButton('Nulstil');
  nulstilSlut.position(knapPositionX + 230, knapPositionY + 70);
  nulstilSlut.class('button-style');
  nulstilSlut.mousePressed(() => {
    slutby = null;
    setup();
  });

  let brute = createButton('Brute Force');
  brute.position(knapPositionX, knapPositionY + 300);
  brute.class('button-style')
  brute.mousePressed(() => {
    bruteForce();
  });
  
}



function mousePressed() {
  if (vælgerStartby) {
    for (const by of byer) {
      if (dist(mouseX, mouseY, by.x, by.y) < radius / 2) {
        startby = by.navn;
        vælgerStartby = false;

        setup(); 
        break;
      }
    }
  }

  if (vælgerSlutby) {
    for (const by of byer) {
      if (dist(mouseX, mouseY, by.x, by.y) < radius / 2) {
        slutby = by.navn;
        vælgerSlutby = false; 
        setup();
        break;
      }
    }
  }
}




function tekst() {
  let tekstPositionX = kort.width * scale + 40
  let tekstPositionY = 40
  textSize(30);
  textAlign(LEFT);
  
  if (startby == null){
    text("Startby: Ikke valgt", tekstPositionX, tekstPositionY) 
  } else{
    text("Startby: "+ startby, tekstPositionX, tekstPositionY)
  }

  if (slutby == null){
    text("Slutby: Ikke valgt", tekstPositionX, tekstPositionY + 50) 
  } else{
    text("Slutby: "+ slutby, tekstPositionX, tekstPositionY + 50)
  }

}


let sti = []

function bruteForce(){
  if (!startby || !slutby) {
    console.log("Startby og Slutby skal vælges først!");
    return;
  }

  sti = []
  let nuby = startby;
  let besøgte =[startby];

  while (nuby !== slutby){
    //let muligeveje = 

    
  }
}

function findVejeMedBy(by, veje, sti){
  //by=København er en string og veje er en liste over alle veje
  console.log(veje)
  let l = []
  for (let index = 0; index < veje.length; index++) {
    const by1navn = veje[index].by1.navn;
    const by2navn = veje[index].by2.navn;
    console.log(by1navn, by2navn)

    if(by1navn === by || by2navn === by){
      l.push(veje[index])
      sti.push(veje[index])
    }

    
  }

  return l;
}

console.log(findVejeMedBy("København", veje))