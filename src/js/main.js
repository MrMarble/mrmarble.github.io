import { Illustration, Shape, Anchor, Vector, Group, TAU } from "zdog";

const illoElem = document.querySelector(".avatar");
const illoRect = illoElem.getBoundingClientRect();

illoElem.setAttribute("width", illoRect.width);
illoElem.setAttribute("height", illoRect.height);

let illoElemX = illoRect.left + illoRect.width / 2;
let illoElemY = illoRect.top + illoRect.height / 2;

const illoSize = 40;
let zoom = Math.floor(illoRect.width / illoSize);

const mouse = { x: 0, y: 0 };

let isSpinning = true;

function map(n, start1, stop1, start2, stop2) {
  let newVal = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  return Math.max(Math.min(newVal, stop2), start2);
}

function lookAtMouse() {
  let x = map(mouse.x - illoElemX, -illoElemX + 10, illoElemX, -0.8, 0.8);
  let y = map(mouse.y - illoElemY, -illoElemY + 10, illoElemY, -0.5, 0.5);
  let rotateVector = { y: -x, x: -y };
  illo.rotate = rotateVector;
  illo.updateRenderGraph();
}

function rotate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame(rotate);
}

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  isSpinning = false;
  requestAnimationFrame(lookAtMouse);
});

const illo = new Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function () {
    isSpinning = false;
  }
});

// colors
const colors = {
  eye: "#2e1606",
  white: "#FFF",
  hair: "#0f0800",
  beard: "#1c0f00",
  overalls: "#24D",
  cloth: "#0f0800",
  skin: "#FC9",
  ear: "#ffbe7d",
  nose: "#fb9",
  leather: "#A63",
};

// -- illustration shapes --- //

// head
let head = new Shape({
  addTo: illo,
  translate: { y: 0, z: 1 },
  color: colors.skin,
  stroke: 21,
});

// nose
new Shape({
  addTo: head,
  translate: { y: 5, z: 13 },
  color: colors.nose,
  stroke: 5,
});

// chin
let chin = new Shape({
  addTo: head,
  path: [
    { x: -5, y: 6, z: 4 },
    { x: 0, y: 8.5, z: 6 },
  ],
  color: colors.skin,
  stroke: 9,
});
chin.copy({
  scale: { x: -1 },
});

// mouth
new Shape({
  path: [
    { x: -3, y: -3 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 3, y: -3 },
  ],
  translate: { y: 12, z: 9 },
  color: colors.white,
  fill: true,
  stroke: 2,
  addTo: head,
});

let hat = new Anchor({
  addTo: head,
  translate: { y: -8 },
});

// hat front
let hatFrontA = new Vector({ x: -8, y: 0, z: 5 });
let hatFrontB = new Vector({ x: -4, y: -3, z: 7 });
let hatFrontC = hatFrontB.copy().multiply({ x: -1 });
let hatFrontD = hatFrontA.copy().multiply({ x: -1 }).add({y:-2});

// hat front
new Shape({
  path: [hatFrontA, hatFrontB, hatFrontC, hatFrontD],
  color: colors.hair,
  closed: false,
  fill: false,
  stroke: 5,
  addTo: hat,
});

let hatTopFront = new Vector({ x: 10, y: 1, z: 5 });
let hatTopBackA = new Vector({ x: 7, y: 5, z: -10 });
let hatTopBackB = hatTopBackA.copy().multiply({ x: -1 });

// hat top
new Shape({
  path: [
    hatTopFront.copy().multiply({ x: -1 }),
    hatTopFront,
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  stroke: 5,
  addTo: hat,
});
// hat top back
new Shape({
  path: [hatTopBackA, hatTopBackB],
  color: colors.cloth,
  stroke: 6,
  addTo: hat,
});

// hat top side
let hatTopSide = new Shape({
  path: [hatTopFront, hatTopBackA],
  color: colors.cloth,
  stroke: 5,
  addTo: hat,
});
hatTopSide.copy({
  scale: { x: -1 },
});

// hat top cover
new Shape({
  path: [
    { x: -6, y: 1, z: -8 },
    { x: 6, y: 1, z: -8 },
    { x: 6, y: -2, z: 4 },
    { x: -6, y: -2, z: 4 },
  ],
  color: colors.cloth,
  stroke: 6,
  addTo: hat,
});

//fringe
new Shape({
    path: [
        { x: -12, y: 0, z: 8 },
        { x: -11, y: -6, z: 8 },
        { x: 0, y: -4, z: 8 },
      ],
      color: colors.hair,
      stroke: 2,
      addTo: hat,
      closed:true
})
new Shape({
    path: [
        { x: -8, y: -3, z: 8 },
      ],
      color: colors.hair,
      stroke: 7,
      addTo: hat,
      closed:true
})
// eyes pupil
let eye = new Shape({
  path: [{ y: 2 }, { y: 4 }],
  translate: { x: 5, z: 9 },
  color: colors.eye,
  stroke: 3,
  addTo: head,
});
eye.copy({
  translate: { x: -5, z: 9 },
});

let brow = new Shape({
  path: [
    { x: 3, y: 0, z: -0 },
    { x: 1.5, y: -0.5, z: 1 },
    { x: 0, y: 0, z: 1 },
  ],
  translate: { x: 4, y: -1.5, z: 9 },
  color: colors.hair,
  closed: false,
  stroke: 2.5,
  addTo: head,
});
brow.copy({
  scale: { x: -1 },
  translate: { x: -4, y: -1.5, z: 9 },
});

let mustache = new Group({
  addTo: head,
  translate: { y: 6.5, z: 10 },
});
// mustache line
new Shape({
  path: [
    { x: 2, y: 1, z: 1.5 },
    { x: 6.5, y: 0, z: -0 },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: mustache,
});
// mustache sections
let mustacheSection = new Shape({
  translate: { x: 1.75, y: 1.5, z: 1 },
  color: colors.beard,
  stroke: 2,
  addTo: mustache,
});
mustacheSection.copy({
  translate: { x: 4.5, y: 1, z: 0.75 },
});

mustache.copyGraph({
  scale: { x: -1 },
});

//billy-goat
new Shape({
  path: [
    { x: 6.5, y: 0 },
    { x: 4, y: 5, z: -2 },
    { x: 0, y: 6, z: -2 },
    { x: -4, y: 5, z: -2 },
    { x: -6.5, y: 0 },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: mustache,
  closed: false,
});

const beardL = new Anchor({
  translate: { x: 10, y: 3, z: 2 },
  addTo: head,
});

new Shape({
  path: [
    { y: 0, z: 0 },
    {
      arc: [
        { y: 8, z: 0, x: 2 },
        { y: 8, z: 0, x: -4 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardL,
  closed: false,
});

new Shape({
  path: [
    { y: 1, z: 2.5, x: 0 },
    {
      arc: [
        { y: 8, z: 1, x: 0 },
        { y: 8, z: 1, x: -7 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardL,
  closed: false,
});
new Shape({
  path: [
    { y: 2, z: 4, x: -1 },
    {
      arc: [
        { y: 9, z: 3, x: -1 },
        { y: 9, z: 3, x: -10 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardL,
  closed: false,
});
new Shape({
  path: [
    { y: 3, z: 6, x: -2 },
    {
      arc: [
        { y: 10, z: 5, x: -2 },
        { y: 10, z: 5, x: -10 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardL,
  closed: false,
});
const beardR = new Anchor({
  translate: { x: -10, y: 3, z: 2 },
  addTo: head,
});
new Shape({
  path: [
    { y: 0, z: 0 },
    {
      arc: [
        { y: 8, z: 0, x: -2 },
        { y: 8, z: 0, x: 4 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardR,
  closed: false,
});

new Shape({
  path: [
    { y: 1, z: 2 },
    {
      arc: [
        { y: 8, z: 1, x: 0 },
        { y: 8, z: 1, x: 7 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardR,
  closed: false,
});
new Shape({
  path: [
    { y: 2, z: 4, x: 1 },
    {
      arc: [
        { y: 9, z: 3, x: 1 },
        { y: 9, z: 3, x: 10 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardR,
  closed: false,
});
new Shape({
  path: [
    { y: 3, z: 6, x: 2 },
    {
      arc: [
        { y: 10, z: 5, x: 2 },
        { y: 10, z: 5, x: 10 },
      ],
    },
  ],
  color: colors.beard,
  stroke: 2,
  addTo: beardR,
  closed: false,
});

let sideburns = new Shape({
  path: [
    { y: 0, z: 0 },
    { y: -4, z: 1.5 },
    { y: -4, z: 1 },
    { y: -1, z: 2 },
    { y: -4, z: -6 },

  ],
  translate: { x: 10, y: 0, z: 2 },
  color: colors.hair,
  closed: false,
  fill: true,
  stroke: 2,
  addTo: head,
});
sideburns.copy({
  translate: sideburns.translate.copy().multiply({ x: -1 }),
});

let ear = new Shape({
  path: [
    { x: 0, y: 0, z: -0 },
    { x: 0, y: -4, z: -0 },
    { x: 1, y: -4, z: -2 },
    { x: 0, y: 0, z: -1 },
  ],
  translate: { x: 10, y: 4, z: -2 },
  color: colors.ear,
  fill: true,
  stroke: 3,
  addTo: head,
});
ear.copy({
  scale: { x: -1 },
  translate: ear.translate.copy().multiply({ x: -1 }),
});

let sideHair = new Anchor({
  addTo: head,
});

// hair side panel
new Shape({
  path: [
    { x: 4, y: -7, z: -1 },
    { x: 3, y: 0, z: -0 },
    { x: 0, y: 0, z: -5 },
    { x: 2, y: -6.5, z: -6 },
  ],
  translate: { x: 5, y: 7, z: -5 },
  color: colors.hair,
  fill: true,
  stroke: 3,
  addTo: sideHair,
});
// hair balls
let hairBall = new Shape({
  translate: { x: 6, y: 8, z: -8 },
  color: colors.hair,
  stroke: 4,
  addTo: sideHair,
});
hairBall.copy({
  translate: { x: 2, y: 8, z: -10 },
});

sideHair.copyGraph({
  scale: { x: -1 },
});

// hair back panel
new Shape({
  path: [
    { x: 5, y: 0, z: -0 },
    { x: 6, y: -6.5, z: -1 },
    { x: -6, y: -6.5, z: -1 },
    { x: -5, y: 0, z: -0 },
  ],
  translate: { y: 7, z: -10 },
  color: colors.hair,
  fill: true,
  stroke: 3,
  addTo: head,
});

// -- lookAtMouse --- //

let lens = new Shape({
  addTo: head,
  path: [
    { x: -5, y: 0 },
    {
      arc: [
        { x: -5, y: -1 },
        { x: 1, y: -1 },
      ],
    },
    { x: 3, y: -1 },
    {
      arc: [
        { x: 4, y: -1 },
        { x: 4, y: 0 },
      ],
    },
    { x: 4, y: 1 },
    {
      arc: [
        { x: 4, y: 3 },
        { x: 2, y: 3 },
      ],
    },
    { x: 1, y: 5 },
    { x: -2, y: 5 },
    {
      arc: [
        { x: -5, y: 5 },
        { x: -5, y: 0 },
      ],
    },
  ],
  closed: false,
  stroke: 1,
  color: "gray",
  backface: false,
  translate: { z: 12, x: -4 },
});
lens.copy({
  translate: { x: 4, z: 12 },
  rotate: { y: TAU / 2 },
  backface: true,
});

let leg = new Shape({
  addTo: lens,
  path: [
    { x: -5, y: 0 },
    { x: -5, z: -15 },
  ],
  closed: false,
  stroke: 1,
  color: "gray",
  backface: false,
});
leg.copy({
  translate: { x: 18 },
  backface: true,
});

rotate();
