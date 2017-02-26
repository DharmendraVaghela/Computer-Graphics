/* classes */ 

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class

function getInputSpheres() {
    const INPUT_SPHERES_URL = 
        "https://ncsucgclass.github.io/prog1/spheres.json";
        
    // load the spheres file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_SPHERES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input spheres file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
}

function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
}

    

function drawSpheres(context) {

    var eye = new Vector(0.5,0.5,-0.5);
    var viewup = new Vector(0,1,0);
    var lookat = new Vector(0,0,1);
    var cl = new Color(0, 0, 0, 255);
    var w = context.canvas.width, h = context.canvas.height;
    const PIXEL_DENSITY = 0.1;
    var numCanvasPixels = (w * h) * PIXEL_DENSITY;
    var imageData = context.createImageData(w, h);

    var inputSpheres = getInputSpheres();

    if (inputSpheres != String.null) {
        
        var n = inputSpheres.length;
        for (i = 0; i < context.canvas.width; i++) {
             for (j = 0; j < context.canvas.height; j++) {
                drawPixel(imageData, i, j, cl);
            }
        }

        for (var i = 0; i <= 1; i = i + 1 / w) {
            for (var j = 0; j <= 1; j = j + 1 / h) {
                var direction = new Vector(i-eye.x,j-eye.y,-eye.z);
                for (var s = 0; s < n; s++) {

                    var circle = new Vector(inputSpheres[s].x,inputSpheres[s].y,inputSpheres[s].z)
                    var r = inputSpheres[s].r;

                    var EC = sub(eye,circle);

                    var a = dot(direction,direction);
                    var b = 2 * dot(direction,EC);
                    var c = dot(EC,EC) - r * r;
                    var discr = (b * b - (4 * a * c));
                    if (discr >= 0) {
                        cl.change(inputSpheres[s].diffuse[0] * 255,inputSpheres[s].diffuse[1] * 255,inputSpheres[s].diffuse[2] * 255,255);
                        drawPixel(imageData, i * w, j * h, cl);
                    } else {    
                              
                    }
                }
            }
        }


context.putImageData(imageData, 0, 0);

}

}

function shadeSphere(context){
    var eye = new Vector(0.5,0.5,-0.5);
    var viewup = new Vector(0,1,0);
    
    var cl = new Color(0, 0, 0, 255);
    var w = context.canvas.width, h = context.canvas.height;
    const PIXEL_DENSITY = 0.1;
    var numCanvasPixels = (w * h) * PIXEL_DENSITY;
    var imageData = context.createImageData(w, h);
    var reflection = new Vector(1,1,1);
    var light = new Vector(2,4,-0.5);

    //normalised vectors
    //var N = normalize(new Vector(0,0,1));

    var inputSpheres = getInputSpheres();

    if (inputSpheres != String.null) {
        var n = inputSpheres.length;
        for (i = 0; i < context.canvas.width; i++) {
             for (j = 0; j < context.canvas.height; j++) {
                drawPixel(imageData, i, j, cl);
            }
        }
        for (var i = 0; i <= 1; i = i + 1 / w) {
            for (var j = 0; j <= 1; j = j + 1 / h) {
                var direction = new Vector(i-eye.x,j-eye.y,-eye.z);
                //N = normalize(sub(eye);//eye direction
                //L = normalize(new Vector());//light direction
                for (var s = 0; s < n; s++) {

                    var circle = new Vector(inputSpheres[s].x,inputSpheres[s].y,inputSpheres[s].z)
                    var r = inputSpheres[s].r;

                    var EC = sub(eye,circle);

                    var a = dot(direction,direction);
                    var b = 2 * dot(direction,EC);
                    var c = dot(EC,EC) - r * r;
                    var discr = (b * b - (4 * a * c));
                    var root = 0;

                    if (discr >= 0) {
                        root = ((-1 * b) - Math.sqrt(discr)) * (1 / (2 * a));
                        var nc = new Vector(eye.x + root * direction.x, eye.y + root * direction.y, eye.z + root * direction.z);
                        //var ambience = new Vector(inputSpheres[s].ambient[0],inputSpheres[s].ambient[1],inputSpheres[s].ambient[2]);
                        var L = normalize(new Vector(light.x-nc.x,light.y-nc.y,light.z-nc.z));
                        var V = normalize(new Vector(eye.x-nc.x,eye.y-nc.y,eye.z-nc.z));
                        var N = normalize(new Vector(nc.x-circle.x,nc.y-circle.y,nc.z-circle.z));
                        var V = normalize(new Vector(V.x+L.x,V.y+L.y,V.z+L.z));
                        //var diffuse = mul(new Vector(inputSpheres[s].diffuse[0],inputSpheres[s].diffuse[1],inputSpheres[s].diffuse[2]),dot(N,L));
                        var diffu = dot(N,L);
                        var specu = Math.pow(dot(N,V),2);
                        //var R = sub(mul(mul(N,2),dot(N,L)),L);
                        //var temp = Math.pow(dot(R,V),inputSpheres[s].n);
                        //var specular = mul(new Vector(inputSpheres[s].specular[0],inputSpheres[s].specular[1],inputSpheres[s].specular[2]),temp);
                        var intensity = new Vector(0,0,0);
                        intensity.x = inputSpheres[s].ambient[0]+(inputSpheres[s].diffuse[0]) * diffu + (inputSpheres[s].specular[0]) * specu;
                        intensity.y = inputSpheres[s].ambient[1]+(inputSpheres[s].diffuse[1]) * diffu + (inputSpheres[s].specular[1]) * specu;
                        intensity.z = inputSpheres[s].ambient[2]+(inputSpheres[s].diffuse[2]) * diffu + (inputSpheres[s].specular[2]) * specu;
                        //var intensity = new Vector(ambience.x+diffuse.x+specular.x,ambience.y+diffuse.y+specular.y,ambience.y+diffuse.y+specular.y);
 
                        ///*
                        
                        
                        if(intensity.x < 0) intensity.x = 0; if(intensity.x > 255) intensity.x = 255;
                        if(intensity.y < 0) intensity.y = 0; if(intensity.y > 255) intensity.y = 255;
                        if(intensity.z < 0) intensity.z = 0; if(intensity.z > 255) intensity.z = 255;

                        cl.change(intensity.x* 255,intensity.y* 255, intensity.z* 255,255);
                        //*/
                            /*
                            document.write(intensity.x);
                            exit;
                        cl.change(
                            (intensity.x)*255,
                            (intensity.y)*255,
                            (intensity.z)*255,
                            100)

                            */

                        drawPixel(imageData, i * w, h-j * h, cl);
                    } else {     

                    }
                }
            }
        }


context.putImageData(imageData, 0, 0);

}



}


function main() {

    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    drawSpheres(context);
    //shadeSphere(context);

}
class Vector {
    constructor(x,y,z) {
        try {
            if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number"))
                throw "component not a number";
            else {
                this.x = x; this.y = y; this.z = z;
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    }

    

}



function dot(v1, v2) {
    try {
        if (v1 instanceof Vector && v2 instanceof Vector) {
            return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
        } else
            throw "not valid vector";
    } // end try
    catch (e) {
        console.log(e);
    }
}

function sub(v1, v2) {
    try {
        if (v1 instanceof Vector && v2 instanceof Vector) {
            return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        } else
            throw "not valid vector";
    } // end try
    catch (e) {
        console.log(e);
    }
}

function normalize(v) {
    try {
        if (v instanceof Vector) {
            sqr = Math.pow((v.x*v.x+v.y*v.y+v.z*v.z),0.5)
            return new Vector(v.x/sqr,v.y/sqr,v.z/sqr);
        } else
            throw "not valid vector";
    } // end try
    catch (e) {
        console.log(e);
    }
}

function mul(v1,m) {
    try {
        if (v1 instanceof Vector) {
            return new Vector(v1.x * m, v1.y * m , v1.z * m);
        } else
            throw "not valid vector";
    } // end try
    catch (e) {
        console.log(e);
    }
}