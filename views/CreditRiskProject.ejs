<!DOCTYPE html>
<html>
    <head>                <meta name="description" content="Credit Risk App">
         <?php include 'assets/includes/header.php'; ?>        
         <script src="js/inverseNorm.js"></script>
    </head>
    <body>
        <div class='jumbotron'>
            <div class="container">
                Distribution of Credit Losses
            </div>
        </div>
		<div class="container">
			
			<div class='row'>
				<div class='col-md-4 holdSection'>
                    <div class='subTitle'>
                        Basic Portfolio Attributes
                    </div>
                    <div class='toggle txt' id='descriptionNumAssets'>
                        The number of assets in the portfolio and the time horizon of the portfolio.  Even very large portfolios can be efficiently computed using this algorithm.
                    </div>
					<div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="NumAssets">Number of Assets</span>
						<input id="n" type="text" name="" class="form-control required" placeholder="10000">
					</div>
                    <div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="NumAssets">Time Horizon</span>
						<input id="t" type="text" name="" class="form-control required" placeholder="1">
					</div>
                    <br>
                </div>
            </div>
            <hr>
            <div class='row'>
                <div id='pdf' class='col-md-4 holdSection'>
                    <div class='subTitle'>
                        Exposure
                    </div>
                    <div class='toggle txt' id='Exposure'>
                        This is the distribution for the exposure of each asset.  In this case, the distribution for each exposure is an identical Gamma distribution with parameters \(a\) and \(b\).  The mean and variance of the distribution is \(ab\) and \(ab^2\) respectively.  In general, the exposures may follow completely different distributions for each asset, but it would be onerous to specify a different distribution for each of \(n\) assets.  
                    </div>
                    <div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">a</span> 
						<input id="a" type="text" name="" class="form-control required" placeholder="50">
					</div> 
					
					<div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">b</span>
						<input id="b" type="text" name="" class="form-control required" placeholder="60">
					</div>
                    
                </div>
                <div class='col-md-8'>   
                    <div id="ExposureChart"></div>
                </div>
            </div>
            <hr>
            <div class='row'>
                <div id='pd' class='col-md-4 holdSection'>
                    <div class='subTitle'>
                        Probability of Default
                    </div>
                    <div class='toggle txt' id='Probability'>
                        Use this to generate the distribution of probabilities of default.  The sample is from a uniform distribution.  Note that this distribution is not incorporated in the actual model; it is simply a technique to generate \(n\) different default probabilities without explicitly defining each probability.  In practice the probabilities of default would be generated from some sort of PD model (preferably one with intensity based modeling rather than static logistic style modeling).  Stochastic default is driven by the Systemic Default Variable below. 
                    </div>
                    <div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">Minimum PD</span> 
						<input id="minPD"  type="text" name="" class="form-control required" placeholder=".001">
					</div> 
					<div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">Maximum PD</span> 
						<input id="maxPD"  type="text" name="" class="form-control required" placeholder=".1">
					</div> 
										
				</div>
				<div class='col-md-8'>   
                    <div id="UniformChart"></div>
                </div>
			</div>
            <hr>
            <div class='row'>
                <div id='ts' class='col-md-4 holdSection'>
                    <div class='subTitle'>
                        Systemic Default Parameters
                    </div>
                    <div class='toggle txt' id='Underlying'>
                        This is the parametrization for the underlying systemic variable which has dynamics \(dX=\alpha(1-X)dt+\sigma dW_t\).  In general this can be an \(m\) dimensional process; however entering parameters for each process would be onerous.  
                    </div>
                    <div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">X0</span> 
						<input id="X0"  type="text" name="" class="form-control required" placeholder="1">
					</div> 
					<div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">alpha</span> 
						<input id="alpha"  type="text" name="" class="form-control required" placeholder=".1">
					</div> 
					
					<div class="input-group"><span class="input-group" id="">
						<span class="input-group-addon" id="">sigma</span>
						<input id="sigma" type="text" name="" class="form-control required" placeholder=".3">
					</div>
                    <!--<div class="">
                        
                    </div>-->
                    <button class='btn btn-success btn-block' id='newSample'>Generate Additional Sample Path</button>
					
				</div>
				<div class='col-md-8'>   
                    <div id="UnderlyingChart"></div>
                </div>
			</div>
            <hr>
			<div class='row'>
                <div class='col-md-4'>
                    <input id='submitButton' type="submit" class="btn btn-primary btn-block"></input>
                
                </div>
                <div class='col-md-8'>
                    <div id="finalChart"></div>
                    <div class='progress'>
                        <div id="progressBar" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
                    </div>
                </div>
            </div>
			
		</div>
        <?php include 'assets/includes/menu.php';?> <!--side menu -->
    </body>
    <?php include 'assets/includes/footerScripts.php';?> <!--final includes for side menu --> 
    <script>
        //$('.toggle').hide();
        $('.progress').hide();//('hidden');
        var exposureChart="";
        var tsChart="";
        var unifChart="";
        var finalChart="";
        var xAxis;
        var yAxis;
        var data={};
        var attributes={};
       
        $('#newSample').click(function(e){
            getValues();
            var data=createTS(attributes.X0, attributes.alpha, attributes.sigma, attributes.t);
            tsChart.addSeries({                        
                name: "Sample Path",
                data: data[1] 
            });
            return false;
        });
        $('span.input-group-addon').click(function(e){
            $(this).closest('.holdSection').find('.toggle').show();
        }); 
        function computeP(){
            var p=[];
            //var l=[];
            var r=[];
            var w=[];
            var max=Number(attributes.maxPD);
            var min=Number(attributes.minPD);
            for(var i=0; i<attributes.n; i++){
                p.push(Math.random()*(max-min)+min);
                r.push(0);
                //l.push(p[i]*100000);
                w.push([1]);
            }
            return [p, r, w];      
        }
        $('#submitButton').click(function(e){
            getValues();
            $('#progressBar').css("width", '0%');            var options={};            var param=computeP();
            options.p=param[0];
            options.l=param[0]; //doesnt matter....not used
            options.r=param[1];//no liquidity
            options.q=0;//no liquidity
            options.rho=[[1]];//['rho'];
            options.alpha=[attributes.alpha];
            options.a=attributes.a;//gamma parameter
            options.b=attributes.b;//gamma parameter
            options.k=512;
            options.h=1024;
            options.t=attributes.t;
            options.sigma=[[attributes.sigma]];
            options.y0=[attributes.X0];
            options.w=param[2];
            options.lambda0=0; //no liquiditiy            if(finalChart){                //console.log(finalChart.xAxis[0]);                console.log(finalChart.xAxis[0].categories[finalChart.xAxis[0].getExtremes().dataMax]);                options.xaxis=finalChart.xAxis[0].categories[finalChart.xAxis[0].getExtremes().dataMax];            }
            $('.progress').show();//('hidden');
            var worker = new Worker('js/distributionCreditRisk.js');  
			worker.postMessage({'options': 
				options
			});
            worker.onmessage = function (event) {
            	if(event.data.update){
					$('#progressBar').css("width", event.data.update);
				} 
				else {
                    $('.progress').hide();
					data=event.data.result;                    if(!finalChart){
                        createFinalChart(data[0], data[1]);                    }                    else {                        finalChart.addSeries({                                                    name: "pdf",                            data: data[1]                        });                    }
					console.log(data);
				}
			};
            return false;
        });
        function createCharts(){
            getValues();
            plotPdf(attributes['a'], attributes['b']);
            plotTS(attributes.X0, attributes.alpha, attributes.sigma, attributes.t);
            plotUnif(attributes.minPD, attributes.maxPD);
        } 
        function refreshChart(id){
            getValues();
            if(id==='pdf'){
                plotPdf(attributes['a'], attributes['b']);
            }
            else if(id==='pd'){
                plotUnif(attributes.minPD, attributes.maxPD);
            }
            else if(id==='ts'){
                plotTS(attributes.X0, attributes.alpha, attributes.sigma, attributes.t);
            }
        }
        $('.form-control').keypress(function(e){
            var id=$(this).closest('.holdSection').attr('id');
            console.log(id);
            setTimeout(function(){
                    refreshChart(id);
                },
                500
            );
        }); 
        function getValues(){ 
            $('input').each(function(){
                var current=$(this);               
                var id=current.attr('id');
                attributes[id]=current.val();
                if(!isNumeric(attributes[id])){ 
                    attributes[id]=Number(current.attr('placeholder'));
                }
                else {
                    attributes[id]=Number(attributes[id]);
                }           
            });
        }
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        } 
        function plotUnif(min, max){
            var range=Number(max);
            var dx=Number(min);
            range=range+dx;
            var discrete=50;
            if(dx!==0){
                discrete=Math.round(range/dx);
            }
            else {
                dx=range/discrete;
            }
            var xSeries=[];
            var ySeries=[];
            var density=1.0/(max-min);
            for(var i=0; i<discrete; i++){
                xSeries.push(i*dx);
                ySeries.push(density);
            }
            unifChart=new Highcharts.Chart({//$('#ExposureChart').highcharts({              
                chart:{
                    type:'spline',
                    renderTo: 'UniformChart'
                },
                title: {
                    text:""
                },
                credits:{
                    enabled:false
                },
                xAxis:{
                    categories:xSeries,
                    labels:{
                        formatter: function() {
                            return Highcharts.numberFormat(this.value,4, ".", ",");
                        }
                    }
                },
                yAxis:{
                    min:0
                },
                legend:{
                    enabled:false
                },
                 plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 4
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                }, 
                series:[
                    {
                        name:'PDF', 
                        data:ySeries
                    }
                ]
            });
        }
        function plotPdf( alpha, beta){
            var range=alpha*beta+5*Math.sqrt(alpha*(beta*beta));
            var discrete=50;
            var dx=range/discrete;
            var data=[];
            //data.push({"xaxis":0, "yaxis":0, "animation":0});
            var xSeries=[];
            var ySeries=[];         
            for(var i=0; i<discrete; i++){
                var x=i*dx;
                var pdf=pdfGamma(x, alpha, beta);
                xSeries.push(x);
                ySeries.push(pdf);
            }            
            exposureChart=new Highcharts.Chart({//$('#ExposureChart').highcharts({
                chart:{
                    type:'spline',
                    renderTo: 'ExposureChart'
                },
                title: {
                    text:""
                },
                credits:{
                    enabled:false
                },
                xAxis:{
                    categories:xSeries,
                    labels:{
                        formatter: function() {
                            return Highcharts.numberFormat(this.value,2, ".", ",");
                        }
                    }
                },
                yAxis:{
                    min:0
                },
                legend:{
                    enabled:false
                },
                plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 4
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                }, 
                series:[
                    {
                        name:'PDF', 
                        data:ySeries
                    }
                ]
            });
        }
        function createFinalChart(x, y){
            finalChart=new Highcharts.Chart({//$('#ExposureChart').highcharts({
                chart:{
                    type:'spline',
                    renderTo: 'finalChart'
                },
                title: {
                    text:""
                },
                credits:{
                    enabled:false
                },
                xAxis:{
                    categories:x,
                    labels:{
                        formatter: function() {
                            return Highcharts.numberFormat(this.value,2, ".", ",");
                        }
                    }
                },
                yAxis:{
                    min:0
                },
                legend:{
                    enabled:false
                },
                plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 4
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                }, 
                series:[
                    {
                        name:'density', 
                        data:y
                    }
                ]
            });
        }
        function createTS(X0,alpha, sigma, t){
            var discrete=200;
            var dx=t/discrete;
            var sdx=Math.sqrt(dx);
            var inv=new inverseNorm();
            var xSeries=[];
            var ySeries=[];
            xSeries.push(0);
            ySeries.push(X0);
            for(var i=1; i<discrete; i++){
                var norm=inv.qNorm(Math.random());
                xSeries.push(i*dx);
                ySeries.push(ySeries[i-1]+alpha*(1.0-ySeries[i-1])*dx+sdx*sigma*norm);
            } 
            return([xSeries, ySeries]);
        }
        function plotTS(X0,alpha, sigma, t){
            var data=createTS(X0, alpha, sigma, t);
            var ySeries=data[1];
            var xSeries=data[0];
            tsChart=new Highcharts.Chart({//$('#UnderlyingChart').highcharts({
                chart:{
                    type:'line',
                    renderTo: 'UnderlyingChart'
                },
                title: {
                    text:""
                },
                credits:{
                    enabled:false
                },
                xAxis:{
                    categories:xSeries,
                    labels:{
                        formatter: function() {
                            return Highcharts.numberFormat(this.value,2, ".", ",");
                        }
                    }
                },
                yAxis:{
                    min:0
                },
                legend:{
                    enabled:false
                },
                plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 4
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                }, 
                series:[
                    {
                        name:'TS', 
                        data:ySeries
                    }
                ] 
            
            });
        }
        function pdfGamma(x, alpha, beta){
            return Math.pow(1.0/beta, alpha)*Math.pow(x, alpha-1)*Math.exp(-x/beta)/gamma(alpha);
        }
        function gamma(z) {
            return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
        }
        createCharts();
    </script>
</head>