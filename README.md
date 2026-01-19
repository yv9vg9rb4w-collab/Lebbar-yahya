<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Desmos Pro</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body{
    margin:0;
    background:#1b1b1b;
    font-family:Arial, Helvetica, sans-serif;
    color:white;
}
.app{
    max-width:500px;
    margin:auto;
    padding:10px;
}
input{
    width:100%;
    height:48px;
    font-size:18px;
    background:#111;
    color:#0f0;
    border:none;
    border-radius:8px;
    padding:6px;
    margin-bottom:6px;
}
.controls{
    display:flex;
    gap:6px;
}
.controls button{
    flex:1;
    height:36px;
    border:none;
    border-radius:6px;
    background:#2196f3;
    color:white;
}
.grid{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:6px;
    margin:8px 0;
}
button{
    height:40px;
    border:none;
    border-radius:8px;
    background:#333;
    color:white;
}
.op{background:#ff9800;color:black;}
.eq{background:#4caf50;}
.fn{background:#555;}
canvas{
    background:#111;
    border-radius:10px;
    touch-action:none;
}
</style>
</head>

<body>

<div class="app">

<input id="eq1" placeholder="y = x^2">
<input id="eq2" placeholder="y = sin(x)">
<input id="eq3" placeholder="y = x^3 - x">

<div class="controls">
<button onclick="toggleMode()">RAD</button>
<button onclick="resetView()">RESET</button>
<button onclick="drawAll()">DRAW</button>
</div>

<div class="grid">
<button class="fn" onclick="add('sin(')">sin</button>
<button class="fn" onclick="add('cos(')">cos</button>
<button class="fn" onclick="add('tan(')">tan</button>
<button class="fn" onclick="add('√')">√</button>
<button onclick="add('pi')">π</button>

<button onclick="add('7')">7</button>
<button onclick="add('8')">8</button>
<button onclick="add('9')">9</button>
<button class="op" onclick="add('/')">÷</button>
<button onclick="add('^2')">x²</button>

<button onclick="add('4')">4</button>
<button onclick="add('5')">5</button>
<button onclick="add('6')">6</button>
<button class="op" onclick="add('*')">×</button>
<button onclick="add('^3')">x³</button>

<button onclick="add('1')">1</button>
<button onclick="add('2')">2</button>
<button onclick="add('3')">3</button>
<button class="op" onclick="add('-')">−</button>
<button onclick="add('x')">x</button>

<button onclick="add('0')">0</button>
<button onclick="add('.')">.</button>
<button onclick="clearAll()">C</button>
<button class="op" onclick="add('+')">+</button>
<button class="eq" onclick="drawAll()">=</button>
</div>

<canvas id="graph" width="480" height="320"></canvas>

</div>

<script>
const canvas=document.getElementById("graph");
const ctx=canvas.getContext("2d");
let rad=true;
let scale=30, offX=0, offY=0;
let dragging=false, lastX=0, lastY=0;

function add(v){
    document.activeElement.value+=v;
}
function clearAll(){
    eq1.value="";eq2.value="";eq3.value="";
    drawAxes();
}
function toggleMode(){
    rad=!rad;
    document.querySelector(".controls button").innerText=rad?"RAD":"DEG";
}
function resetView(){
    scale=30;offX=0;offY=0;
    drawAll();
}

function parse(e){
    return e.replace(/√/g,"Math.sqrt(")
            .replace(/\^/g,"**")
            .replace(/sin/g,rad?"Math.sin":"dSin")
            .replace(/cos/g,rad?"Math.cos":"dCos")
            .replace(/tan/g,rad?"Math.tan":"dTan")
            .replace(/pi/g,"Math.PI");
}

function drawAxes(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#555";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2+offX,0);
    ctx.lineTo(canvas.width/2+offX,canvas.height);
    ctx.moveTo(0,canvas.height/2+offY);
    ctx.lineTo(canvas.width,canvas.height/2+offY);
    ctx.stroke();
}

function drawEq(expr,color){
    try{
        ctx.strokeStyle=color;
        ctx.beginPath();
        let first=true;
        for(let px=0;px<canvas.width;px++){
            let x=(px-canvas.width/2-offX)/scale;
            let y=Function("x","return "+parse(expr))(x);
            let py=canvas.height/2 - y*scale + offY;
            if(first){ctx.moveTo(px,py);first=false;}
            else ctx.lineTo(px,py);
        }
        ctx.stroke();
    }catch{}
}

function drawAll(){
    drawAxes();
    if(eq1.value) drawEq(eq1.value.replace("y=",""),"#00ff00");
    if(eq2.value) drawEq(eq2.value.replace("y=",""),"#ff5252");
    if(eq3.value) drawEq(eq3.value.replace("y=",""),"#03a9f4");
}

// ZOOM
canvas.addEventListener("wheel",e=>{
    scale+=e.deltaY<0?2:-2;
    if(scale<10) scale=10;
    drawAll();
});

// DRAG
canvas.addEventListener("pointerdown",e=>{
    dragging=true; lastX=e.clientX; lastY=e.clientY;
});
canvas.addEventListener("pointermove",e=>{
    if(dragging){
        offX+=e.clientX-lastX;
        offY+=e.clientY-lastY;
        lastX=e.clientX; lastY=e.clientY;
        drawAll();
    }
});
canvas.addEventListener("pointerup",()=>dragging=false);

function dSin(x){return Math.sin(x*Math.PI/180);}
function dCos(x){return Math.cos(x*Math.PI/180);}
function dTan(x){return Math.tan(x*Math.PI/180);}

drawAxes();
</script>

</body>
</html>
