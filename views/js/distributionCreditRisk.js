self.addEventListener('message', function(e) {
	importScripts('http://cdnjs.cloudflare.com/ajax/libs/mathjs/1.6.0/math.min.js');
	var data=e.data;
	var options=data.options;
    var x="";
    var y="";
    var ValueAtRisk="";
    //var q=0; //simplicity, ignore liquidity
    //var r=0; //simplicity, ignore liquidity
	CreditRisk(options);
    function CreditRisk(options){
        var p=options['p'];
        var l=options['l'];
        var r=options['r'];
        var q=options['q'];
        var rho=options['rho'];
        var alpha=options['alpha'];
        var a=options['a'];//gamma parameter
        var b=options['b'];//gamma parameter
        var k=options['k'];
        var h=options['h'];
        var tau=options['t']; 
        var sigma=options['sigma'];
        var w=options['w'];
        var lambda0=options['lambda0'];
        var y0=options['y0'];        var xaxis=options.xaxis;
        //computeXmax(15);       // console.log(xaxis);
        //var xmax=computeXmax(15);
        var m=sigma.length;        var riskContribution=[];        var elContribution=[];
        var n=p.length;        var lambda=0;        for(var i=0; i<n; i++){            lambda=lambda+r[i];        }        var eLoss=0;        var varL=0;
        //var xmax=a*b*.2*n; //this is definely not the right way to do this...        var xmax=0;        if(xaxis){            xmax=xaxis;        }        else {            xmax=computeXmax(10);
        }
       // console.log(xmax);
        computeDistribution(k, h, xmax);
        function computeXmax(c){            var el=getEL();            var vl=getVariance();
            return(el+c*Math.sqrt(vl));
        }
        function helpComputeMoments(alpha){ //hleper function since called so much
            return((1-Math.exp(-alpha*tau))/alpha);
        }
        function phiZ(v){ //v has length m and is complex...
            var el=math.complex(0, 0); 
            var varL=math.complex(0, 0);
            for(var i=0; i<m; i++){
                var ai=helpComputeMoments(alpha[i]);
                var eli=math.multiply(v[i], (y0[i]-1)*ai+tau);
                el=math.add(el, eli);
                //double vari=0;
                for(var j=0; j<m; j++){
                    var aj=helpComputeMoments(alpha[j]);
                    var helpVarij=(rho[i][j]*sigma[i]*sigma[j]/(alpha[i]*alpha[j]))*(tau-ai-aj+(1-Math.exp(-(alpha[i]+alpha[j])*tau))/(alpha[i]+alpha[j])); //difra page 10
                    //var varij=math.complex(helpVarij, 0);
                    varL=math.add(varL, math.multiply(math.multiply(helpVarij, v[j]), v[i]));
                }                
            }
            varL=math.add(math.multiply(varL, .5), el);
            var phi=math.exp(varL);
            return phi;    
        }
        function computeV(u){ //returns array of complex
            var v=[];//new Complex[m];
            var upperU=math.complex(0, u*lambda); //liquidity risk..u*lambda*i
            var upperU1=math.multiply(math.subtract(math.exp(upperU), 1.0), q);//.multiply(new Complex(0, 1));//q*(exp(i*u*lambda)-1) 
            var upperU2=math.add(upperU1, math.complex(0, u)); //liquidity..u*i+q*(exp(u*lambda*i)-1)
            var vp=math.complex(0, 0); 
            var phiForL=[]; //compute this variable ahead of time so only has to be computed once. 
            for(var i=0; i<n;i++){
                var helperV=w[i][0]*p[i]; //w_{j, k}*p_j
                var tmpPhi=math.subtract(phiL(upperU2, l[i]), 1.0);
                phiForL.push(tmpPhi);//e^{i*u*l_j}-1
                vp=math.add(vp, math.multiply(helperV, tmpPhi)); //w_{j, k}p_j*(e^{i*u*l_j}-1)             
            }
            v.push(vp);
            for(var j=1; j<m; j++){ 
                var vp=math.complex(0, 0);
                for(var i=0; i<n;i++){
                    var helperV=w[i][j]*p[i]; //w_{j, k}*p_j
                    //var phiForL=math.add(phiL(upperU, l[i]), -1);//e^{i*u*l_j}-1
                    //console.log(math.multiply(helperV, phiForL));
                    vp=math.add(vp, math.multiply(helperV, phiForL[i])); //w_{j, k}p_j*(e^{i*u*l_j}-1)
                  
                }
                v.push(vp);
            }
            return(v);
        } 
        function power(x, y){ //user defined function..for some reason math.pow treats complex as matrix and only allows positive integer exponents
            var real=math.re(x);
            var im=math.im(x);
            var mod=math.sqrt(real*real+im*im);
            var arg=math.atan2(im, real);
            var log_re=math.log(mod);
            var log_im=arg;
            var xlog=y*log_re;
            var xlogim=y*log_im;
            mod=math.exp(xlog);
            return(math.complex(mod*math.cos(xlogim), mod*math.sin(xlogim)));
        }
        function phiL(u, l){ //gamma distribution...u is complex
            var gm=power(math.subtract(1, math.multiply(u, b)), -a);
            //var gm=math.exp(math.multiply(u, l));
            return(gm); //e^{u*l}
        }
        function computeDistribution(
            k, //number of u discretions
            h, //number of x discretions
            xmax
        ) { //items that may vary...
            var du=Math.PI/xmax;
            var dx=xmax/(h-1);
            var cp=2.0/xmax;
            var f=[];// f=new double[k];
            y=[]; //y=new double[h];
            x=[]; //x=new double[h];
            
            ValueAtRisk={};
            var cdf=0;
            var denominator=Number(k+h/n);
            for(var j=0; j<k; j++){
                var updateRatio=(j*100)/denominator;
                self.postMessage({update: updateRatio+'%'}); 
                var v=computeV(du*j);
                var vp=phiZ(v);
                f.push(math.re(vp)*cp);
            }
            f[0]=.5*f[0];
            exloss=0;
            vloss=0;
            var cdf=0;
            var mx=0;
            var yp=0;            var maxY=0;
            for(var i=0;  i<h; i++){
                yp=0;
                x.push(dx*i);
                var updateRatio=(k+i/n)*100/denominator;
                self.postMessage({update: updateRatio+'%'}); 
                for(var j=0; j<k; j++){
                    yp=yp+f[j]*Math.cos(du*j*dx*i);
                }                  if(yp>maxY){                    maxY=yp;                }
  
                y.push(yp);
                vloss=vloss+yp*i*dx*dx*i; 
                exloss=exloss+yp*i*dx; 
                
                cdf=cdf+yp*dx;//ccomputes cumulative density
            }
            if(cdf>mx){
                ValueAtRisk[mx.toString()]=x[i];
                mx=mx+.001;
            }
            //self.postMessage( {result:[x, y]});                 self.postMessage( {result:{"x":x, "y":y, "maxY":maxY}}); 
            
            exloss=exloss-xmax*.5*y[h-1];
            exloss=exloss*dx; 
            vloss=vloss-xmax*.5*xmax*y[h-1];
            vloss=vloss*dx;
            vloss=vloss-exloss*exloss;
            //console.log(exloss);
        }
        function getDomain(){
            return x;
        }
        function getVaR(confidenceLevel){
            return ValueAtRisk[confidenceLevel];
        }   
        function getDistribution(){
            return y;
        }
        function getNumericalExLoss(){
           return exloss;
        } 
        function getNumericalVariance(){
           return vloss;
        }

        function getAnalyticRiskContribution(k, c){
            if(!riskContribution){
                computeMoments();
            }
            return elContribution[k]+c*riskContribution[k]/(Math.sqrt(varL));
        }
        /*Better compute moments */
        function computeVariance(c1, c2){ //both arrays
            var varianceY=0;
            for(var i=0; i<m; i++){
                var ai=helpComputeMoments(alpha[i]);
                for(var j=0; j<m; j++){
                    var aj=helpComputeMoments(alpha[j]);
                    varianceY=varianceY+(c1[i]*c2[j]*rho[i][j]*sigma[i]*sigma[j]/(alpha[i]*alpha[j]))*(tau-ai-aj+(1-Math.exp(-(alpha[i]+alpha[j])*tau))/(alpha[i]+alpha[j]));
                
                }
            
            }
            return varianceY;
        }

        function computeEL(c1){ //array
            var expectationY=0;
            for(var i=0; i<m; i++){
                var ai=helpComputeMoments(alpha[i]);
                expectationY=expectationY+((y0[i]-1)*ai+tau)*c1[i];
            }
            return expectationY;
        }
        function computeMoments(){ //computes analytical expectation and variance
            var varP=[];//new double[m];
            var pl=[];//new double[m];
            var plE=[];//new double[m];
            var eLossP=[];//new double[m];
            varL=0;
            eLoss=0;
            //compute ek and vk
            var ek=[];//new double[m];
            var vk=[];//new double[m];
            var mvk=[];//new double[m];
            for(var j=0; j<m; j++){
                ek.push(0);
                vk.push(0);
                for(var i=0; i<n; i++){
                    //ek[j]=ek[j]+p[i]*l[i]*w[i][j];                    ek[j]=ek[j]+p[i]*a*b*w[i][j];
                    //vk[j]=vk[j]+p[i]*l[i]*w[i][j]*l[i];	                    vk[j]=vk[j]+p[i]*w[i][j]*(b*b*(a+a*a));	
                }
            }
            /*compute expected loss and variance */
            eLoss=computeEL(ek);
            varL=computeVariance(ek, ek)+computeEL(vk);
            
            /*compute marginal contributions */

            var lmdbq0=(1+lambda0*q);
            for(var i=0; i<n; i++){
                riskContribution.push(0);
                //elContribution[i]=0;
                var elW=computeEL(w[i]);//this is clever
                //elContribution[i]=p[i]*l[i]*elW;
                elContribution.push(p[i]*l[i]*elW*(1+lambda0*q)+r[i]*l[i]*q*eLoss);
                riskContribution[i]=p[i]*l[i]*l[i]*elW;
                var vlW=computeVariance(w[i], ek);//this is clever
                riskContribution[i]=riskContribution[i]+p[i]*l[i]*vlW;
                riskContribution[i]=riskContribution[i]*lmdbq0*lmdbq0;
                riskContribution[i]=riskContribution[i]+q*p[i]*l[i]*lambda0*lambda0*elW;
                riskContribution[i]=riskContribution[i]+2*r[i]*l[i]*q*varL;
                riskContribution[i]=riskContribution[i]+r[i]*l[i]*q*varL*q*(lambda+lambda0);
                riskContribution[i]=riskContribution[i]+r[i]*l[i]*(lambda0+lambda)*q*eLoss;
            }

            var lmdbq=(1+lambda*q);
            varL=varL*lmdbq*lmdbq+eLoss*q*lambda*lambda;
            eLoss=eLoss*lmdbq;
            
        
        }
        
        function addLoan( pt,  lt,  rt, wt){
            p.push(pt);
            l.push(lt);
            r.push(rt);
            w.push(wt);
        }
        function getVariance(){
            if(varL==0){
                computeMoments();
            }
            return varL;
        }
        function getEL(){
            if(eLoss==0){
                computeMoments();
            }
            return eLoss;
        }
        
     
        

    }
    
    
		
});