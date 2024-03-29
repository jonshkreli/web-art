function setup() {
    createCanvas(800, 600,WEBGL);
    //camera(mouseX*13, height/2, (height/2) / tan(PI/6), width/2, height/2, 0, 0, 1, 0);
    perspective(60 / 180 * PI, width/height, 0.4, 10000);

}


var i=0;
var zt=0;
var x=0,y=0,z=0;


class sphereClass{
    constructor(){
        this.spheres = [];
        this.activemode='';
    }
    ActiveMode(){
        let inputs = document.getElementById('mode').getElementsByTagName('input');
        for(const input of inputs) if(input.checked) this.activemode=input.value;
    }
    ActiveFeatures(){
        let returnValues=[];
        let inputs = document.getElementById('features').getElementsByTagName('input');
        for(let i=0; i< inputs.length;++i)  if(inputs[i].checked) returnValues.push(inputs[i].id);
        return returnValues;
    }
    runSpheres(){
        this.ActiveMode();
        this.drawSphere();
        this.showspheres();

        this.ApplyForces(this.ActiveFeatures());

        CheckArrSize(this.spheres);
    }
    drawSphere(){
        if(mouseIsPressed && (key==='d' || this.activemode==='Draw bubbles'))
            //console.log(true)
            this.addSphere()
    }
    addSphere(){
        if(abs( mouseX-pmouseX)>3 && abs(mouseY-pmouseY)>3){
            var coord={x: mouseX, y: mouseY};
            let vector = {x: ( mouseX-pmouseX)/100, y: ( mouseY-pmouseY)/100};
            let colArr = new Array(3);
            for(let i=0;i<3;i++) colArr[i] = Math.floor(Math.random()*255);
            let col={};
            col.rgbaStr = 'rgba('+colArr[0]+','+colArr[1]+','+colArr[2]+',0.9)';
            col.rgbArr = colArr;
            col.c = color(colArr[0],colArr[1],colArr[2],180);
            var sphereData = {};
            sphereData.coord= coord; sphereData.vector = vector; sphereData.col = col;
            this.spheres.push(sphereData);
        }
        //console.log(mouseButton)

    }
    showspheres(){
        //console.log(this.spheres);
        var arrl = this.spheres;
        for(let ele in arrl){
            //console.log(arrl[ele]);

            push();
            translate(-width/2+arrl[ele].coord.x,-height/2+arrl[ele].coord.y,0);
            //arrl[ele].coord.y++;
            arrl[ele].coord.x+=arrl[ele].vector.x; arrl[ele].coord.y+=arrl[ele].vector.y;
            pointLight(50,50,50,130,-300,200);

            //ambientLight(arrl[ele].col.c /*'red'*/);
            specularMaterial(arrl[ele].col.c);
            var size = lerp(0,20,ele/100)+1; //size varies from 1 to 21 (bigger when close to mouse)

            sphere(size);
            pop();
        }
    }
    ApplyForces(forces){
        for(let force of forces) this[force]()
    }
    RevertInBounds(){
        for(let ele=0; ele< this.spheres.length;ele++){
            let sph = this.spheres[ele];
            if(sph.coord.x >= 800 || sph.coord.x<=0 ) sph.vector.x = -sph.vector.x;
            if(sph.coord.y <=0 || sph.coord.y>= 600){
                sph.vector.y = -sph.vector.y;
            }
        }
    }
    Gravity(){
        for (let item of this.spheres) {
            item.vector.y+=0.08;
        }
    }
    MouseTravel(){
        if(mouseIsPressed && (key==='t' || this.activemode==='travel'))
            if(mouseButton===LEFT){ this.addSphere();
                console.log(key)
                for(let ele=0; ele< this.spheres.length;ele++){

                    let sph = this.spheres[ele];
                    let distancex = (mouseX - sph.coord.x)/100;
                    sph.coord.x-=distancex;
                    let distancey = (mouseY - sph.coord.y)/100;
                    sph.coord.y-=distancey;
                }}
    }
    MouseWind(){
        if(mouseIsPressed && (key==='w'|| this.activemode==='wind'))
            if(mouseButton===LEFT)
                for(let ele=0; ele< this.spheres.length;ele++){
                    let sph = this.spheres[ele];
                    let distancex = (width -abs(mouseX - sph.coord.x))/10000;
                    if(mouseX < sph.coord.x) sph.vector.x+=distancex; else sph.vector.x-=distancex;

                    let distancey = (height -abs(mouseY - sph.coord.y))/10000;
                    if(mouseY < sph.coord.y) sph.vector.y+=distancex; else sph.vector.y-=distancex;
                }
    }
    AirFriction(){
        for(let ele=0; ele< this.spheres.length;ele++){
            let svec = this.spheres[ele].vector;
            // if(svec.x>0) svec.x-=0.001; else svec.x+=0.001;
            //if(svec.y>0) svec.y-=0.001; else svec.y+=0.001;
            if(abs(svec.x) > 2)
                svec.x*=0.99;
            if(abs(svec.y) > 2)
                svec.y*=0.99;
        }
    }
    MouseSuck(){
        if(mouseIsPressed && key==='s')
            for(let ele=0; ele< this.spheres.length;ele++){
                let sph = this.spheres[ele];
                let distancex = (width -abs(mouseX - sph.coord.x))/10000;
                if(mouseX < sph.coord.x) sph.vector.x-=distancex; else sph.vector.x+=distancex;

                let distancey = (height -abs(mouseY - sph.coord.y))/10000;
                if(mouseY < sph.coord.y) sph.vector.y-=distancey; else sph.vector.y+=distancey;

                sph.vector.x*=0.99; sph.vector.y*=0.99;
            }
    }
    obstacle(){
        for(var i=0;i<this.spheres.length;i++){
            var sp1 = this.spheres[i];
            for(var j=0;j<this.spheres.length;j++){
                if(i===j) continue;
                var sp2=this.spheres[j];
                //console.log(sp2,i,j)
                if(dist(sp1.coord.x,sp1.coord.y,sp2.coord.x,sp2.coord.y)<=(lerp(0,20,i/100)+lerp(0,20,j/100)+2)){
                    //print(sp1.coord.x,sp1.coord.y,sp2.coord.x,sp2.coord.y)
                    //console.log(sp1.vector.x)
                    sp1.vector.x = -sp1.vector.x; sp1.vector.y = -sp1.vector.y;
                    sp2.vector.x = -sp2.vector.x; sp1.vector.x = -sp1.vector.x;
                    //console.log(sp1.vector.x)
                }
            }
        }
    }
}

/*
 //classic way
 var sphereClass = function () {
 this.spheres = [];
 this.addSphere = function () {
 if(mouseIsPressed){
 if(abs( mouseX-pmouseX)>3 && abs(mouseY-pmouseY)>3){
 var coord={x: mouseX, y: mouseY};
 let vector = {x: ( mouseX-pmouseX)/100, y: ( mouseY-pmouseY)/100};
 let colArr = new Array(3);
 for(let i=0;i<3;i++) colArr[i] = Math.floor(Math.random()*255);
 let color= 'rgba('+colArr[0]+','+colArr[1]+','+colArr[2]+',0.3)';
 var sphereData = {};
 sphereData.coord= coord; sphereData.vector = vector; sphereData.color = color;
 this.spheres.push(sphereData);
 }
 //console.log(mouseButton)
 }
 }
 this.showspheres = function () {
 console.log(this.spheres)
 }
 }
 */

var SphereObj = new sphereClass();

function CheckArrSize(array) {
    if(array.length>100) array.shift();
}
/*
 arrl.addSphere = function () {
 if(mouseIsPressed){
 if(abs( mouseX-pmouseX)>3 && abs(mouseY-pmouseY)>3){
 var coord={x: mouseX, y: mouseY};
 let vector = {x: ( mouseX-pmouseX)/100, y: ( mouseY-pmouseY)/100};
 colArr = new Array(3);
 for(let i=0;i<3;i++) colArr[i] = Math.floor(Math.random()*255);
 let color= 'rgba('+colArr[0]+','+colArr[1]+','+colArr[2]+',0.3)';
 var sphereData = {};
 sphereData.coord= coord; sphereData.vector = vector; sphereData.color = color;
 this.push(sphereData);
 }
 //console.log(mouseButton)
 }
 };
 */

function bgCol() {return document.getElementById('background').value; }
function setambientLight() { return document.getElementById('ambientLight').value;}

function draw() {
    background(bgCol());
    ambientLight(setambientLight());
    if(mouseButton===LEFT  && (key==='o' || SphereObj.activemode==='view control')){
        orbitControl();
    }

    // // Left wall
    // push();
    // translate(-200, 0, 200);
    // rotateY((90 * PI) / 180);
    // plane(400, 300);
    // pop();
    //
    // // Right wall
    // push();
    // translate(200, 0, 200);
    // rotateY((90 * PI) / 180);
    // plane(400, 300);
    // pop();
    //
    // // Bottom wall
    // push();
    // translate(0, 150, 200);
    // rotateX((90 * PI) / 180);
    // plane(400, 400);
    // pop();
    //
    // // Top wall
    // push();
    // translate(0, -150, 200);
    // rotateX((90 * PI) / 180);
    // plane(400, 400);
    // pop();
    //
    // plane(400, 300); // Back wall


    push();
    camera(cos(frameCount * 0.02) * 200, 0, sin(frameCount * 0.02) * 100);
    //directionalLight(25,25,25,-130,-300,-200);
    pointLight(225,225,225,130,300,200);

    // specularMaterial(100,130,20);
    // sphere(30);

    // translate(100,100,3);
    // normalMaterial();
    // box(80);
    //
    // translate(-200,-200,-13); rotateZ(40); rotateY(20);
    // ambientMaterial(20,200,20);
    // cone(30,70);

    pop();
    SphereObj.runSpheres()
}
function mousePressed() {

    print(mouseButton);

    // prevent default
    return false;
}
