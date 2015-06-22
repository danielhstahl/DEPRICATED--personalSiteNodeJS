function thomas(a, b, c, psi){ //a, b, c, psi are vectors, a is complex
    //if b.length=a.length or c.length=a.length, only first n-1 records are used
    var n=a.length;//get number of records on diagonal
    for(var i=1; i<n; i++){ //forward loop
        var gamHat= math.divide(c[i-1], a[i-1]);
        a[i]=math.add(a[i], math.multiply(-b[i-1],gamHat)); //make sure that divide works...
        psi[i]=math.add(psi[i], math.multiply(-psi[i-1], gamHat));
    }
    var phi=new Array(n+2); //the solution
    phi[n]=math.divide(psi[n-1], a[n-1]);
    phi[0]=0; //boundaries..MODIFIED THOMAS
    phi[n+1]=1;//boundaries..MODIFIED THOMAS
    for(var i=(n-2); i>-1; i--){ //backward loop
        phi[i+1]=math.divide(math.add(psi[i], math.multiply(-b[i], phi[i+2])), a[i]);
        phi[i+2]=math.re(phi[i+2]); //only keep real part
    }
    phi[1]=math.re(phi[1]); //only keep real part
    return phi;
}

function ode(n, alpha, sigma, mu, delta, m){ //number of discrete steps, drift, volatility, complex term, CEV parameter, barrier.
    var dx=m/(n-1); //the domain is [0, m] since a CEV process is always positive.
    var a=new Array(n-2);//first and last are boundary conditions
    var b=new Array(n-2);//first and last are boundary conditions
    var c=new Array(n-2);//first and last are boundary conditions
    var psi=new Array(n-2);//first and last are boundary conditions
    var sigs=(sigma*sigma)/(dx*dx);//since used so much...
    for(var i=0; i<(n-2); i++){ //first and last are boundary conditions
        a[i]=math.subtract(math.complex(0, mu), math.pow(dx*(i+1), 2*delta)*sigs); 
        b[i]=math.pow(dx*(i+1), 2*delta)*.5*sigs+.5*alpha*(i+1);
        c[i]=math.pow(dx*(i+2), 2*delta)*.5*sigs-.5*alpha*(i+2); //note that x_{j+1} instead of x_j...
        psi[i]=0;
        //console.log(math.pow(dx*(i+1), 2*delta)*.5*sigs+.5*alpha*(i+1));
      // console.log(sigs);
    } 
    
    psi[n-3]=-b[n-3]; //boundary condition
    //var phi=[];
    //phi.push(0);
    var phi=thomas(a, b, c, psi); //solve equation
    //phi.push(1);
    //console.log(phi);
    return phi;
} 
//function FangOosterlee(n, k, l, m, alpha, delta, sigma, X0, domObject){ //n is the number of u discretions, k is number of t-discretions, l is the discretions in the ODE solution, m is the hitting value, alpha is the drift of dX, delta is the power of X (a value of one corresponds to B-S), and sigma is the volatility
function FangOosterlee(options, domObject){ 
    var n=options['n'];
    var k=options['k'];
    var l=options['l'];
    var m=options['m'];
    var alpha=options['alpha'];
    var delta=options['delta'];
    var sigma=options['sigma'];
    var X0=m*.2;//this seems a little unwise...
    
    
    
    var exVal=math.abs(math.log(m/X0)/(alpha-.5*sigma*sigma)); //expected value of tau when delta=1, used for determining size of t-space
    var std=math.sqrt(math.abs((math.log(m/X0)*sigma*sigma)/(math.pow(alpha-.5*sigma*sigma, 3)))); //standard deviation of tau when delta=1, used for determining size of t-space
    var xMax=exVal+5*std; //a range for t-space...production code would would chebyshev's inequality to compute the range instead of an arbitrary "5"
    var lam=xMax/(k-1);//"dt"
    var dx=m/(l-1); //"dx"
    var du=Math.PI/xMax; //discrete u
    var cp=2/xMax; 
    var phi=[];//array of arrays...
    var initial=ode(l, alpha, sigma, 0, delta, m); //get solution of ODE for each u...this is not included in for loop since we need to multiply by .5
    for(var i=0; i<l; i++){
        initial[i]=initial[i]*.5;
    }
   
    phi.push(initial);
    for(var i=1; i<n; i++){
       // domObject.css("width", i/(n+l)+'%');
        domObject.progressbar( "option", "value", i );
        phi.push(ode(l, alpha, sigma, i*du, delta, m)); //get solution of ODE for each u
    
    }
    var soFar=i;
    var data={}; 

    for(var h=0; h<l; h++){
        //var key="valueIs"+dx*h;
        //domObject.css("width", (soFar+h)/(n+l)+'%');
        domObject.progressbar( "option", "value", soFar+h );
        var key=dx*h;
        key=key.toString();
        data[key]=[];
        //var tmpY=[];
        for(var i=0; i<k; i++){ //iterate over "t" discretions
            var y=0;
            for(var j=0; j<n; j++){
                y=y+phi[j][h]*math.cos(du*j*lam*i)*cp;
                
            }
            data[key].push({"Value":y, "Time": i*lam});
        }
        
    }

    return data;

}