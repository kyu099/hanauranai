const ctx = canvas.getContext("2d");
const share = document.getElementById("sharebutton");

let normal = new Image();
normal.src = "trpfrog-circle.png"
let petal = new Image();
petal.src = "flower.png"

let dark = new Image();
dark.src = "dark-circle.png"
let emerald = new Image();
emerald.src = "emerald-circle.png"
let rainbow = new Image();
rainbow.src = "rainbow-circle.png"
let yellow = new Image();
yellow.src = "yellow-circle.png"

let petals = [];

let n = parseInt(Math.random()*10 + 9);

for(let i=0; i < n; i++) {
    petals.push({num:i, drop:false});
}

function draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    drawFlower(ctx, n);
}

function drawPetals(ctx, i, max) {
    let size = 200;
    let degree = 2 * Math.PI * i / max;
    ctx.translate(parseInt(canvas.width / 2), parseInt(canvas.height / 2));
    ctx.rotate(degree);
    ctx.translate(parseInt(canvas.width / -2), parseInt(canvas.height / -2))
    ctx.drawImage(petal, 220, 60, size, size);
    ctx.translate(parseInt(canvas.width / 2), parseInt(canvas.height / 2));
    ctx.rotate(-degree);
    ctx.translate(parseInt(canvas.width / -2), parseInt(canvas.height / -2))
}

function drawFlower(ctx, n) {
    for(let i in petals){
        if(petals[i].drop == false){
            drawPetals(ctx, i, n);
        }
    }

    ctx.fillStyle = "red"
    ctx.font = '64px sans-serif';
    ctx.textAlign = "center";

    let count = countDrop(petals);
    if(count == 0) {
        ctx.drawImage(normal, 161, 178, 320, 310);
    }else if(count < n){
        if(count % 2 == 0){
            ctx.drawImage(emerald, 161, 178, 320, 310);
            ctx.fillText("ゲムセン行くな！", 320, 100);
        }else if(count % 2 == 1){
            ctx.drawImage(yellow, 161, 178, 320, 310);
            ctx.fillText("ゲムセン行け！", 320, 100);
        }
    }else if(count == n){
        if(count % 2 == 0){
            ctx.drawImage(dark, 161, 178, 320, 310);
            ctx.fillText("ゲムセン行くな！", 320, 100);
        }else if(count % 2 == 1){
            ctx.drawImage(rainbow, 161, 178, 320, 310);
            ctx.fillText("ゲムセン行け！", 320, 100);
        }
    }
    ctx.beginPath();
    ctx.arc(320, 320, 124, 0, 2 * Math.PI, false);
    ctx.stroke();
}

draw(ctx);

let images = [normal, petal];
let loadedCount = 1;
for (let i in images) {
    images[i].addEventListener('load', function() {
        if (loadedCount == images.length) {
            for(let i = 0; i < n; i++){
                drawPetals(ctx, i, n);
            }
            ctx.drawImage(normal, 161, 178, 320, 310);
            ctx.beginPath();
            ctx.arc(320, 320, 124, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        loadedCount++;
    }, false);
}

//頂点を0とした時計回りの角度を返す関数
function returnDegree(x,y) {
    let degree = 0;
    if(x-320 > 0){
        degree = Math.acos(-(y-320)/Math.sqrt((x-320)**2 + (y-320)**2));
    } else {
        degree = Math.acos((y-320)/Math.sqrt((x-320)**2 + (y-320)**2)) + Math.PI;
    }
    return degree;
}

//何枚目の花びらかを返す関数
function returnNumber(degree, n) {
    if(degree < Math.PI/n || degree > 2*Math.PI - Math.PI/n){
        return 0;
    }
    for(let i = 1; i < n; i++){
        if(degree > (i*2*Math.PI/n) - (Math.PI/n) && degree < (i*2*Math.PI/n) + (Math.PI/n)){
            return i;
        }
    }
}

//落ちた花びらの枚数を返す関数
function countDrop(petals){
    let count = 0;
    for(let petal of petals){
        if(petal.drop === true){count++;}
    }
    return count;
}

canvas.addEventListener("click", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    let degree = returnDegree(x,y);
    //console.log(degree);
    if(((x-320)**2 + (y-320)**2 > 124**2) && ((x-320)**2 + (y-320)**2 < 250**2)){
        let num = returnNumber(degree,n);
        for(let i in petals){
            if(i == num){
                petals[i].drop = true;
            }
        }
        //console.log(petals);
    }
    draw(ctx);
}, false);

share.onclick = () => {
    let text ="";
    text = `花占いの結果は……
    https://kyu099.github.io/hanauranai/`

    const cvs = document.getElementById("canvas");

    cvs.toBlob(function(blob) {
        const image = new File([blob], "tmp.png", {type: "image/png"});
        navigator.share({
            text: decodeURI(text),
            files: [image]
        }).then(() => {
            console.log("Share was successful.");
        }).catch((error) => {
            console.log("Sharing failed", error);
        });
    });
}