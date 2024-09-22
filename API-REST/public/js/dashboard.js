
// IP 
window.setTimeout("getip()",1000);
function getip(){
  var xhr=new XMLHttpRequest();
  var url='https://aleatory-api.com.br?format=json';
  xhr.onloadend=function(){
  data=JSON.parse(this.responseText);
  document.getElementById("ip").textContent=data.ip
};
xhr.open("GET",url,true);
xhr.send();
}
 
 function load_quote(){
 	const ajax = new XMLHttpRequest();
 	ajax.open('GET', '', true);
 	ajax.onreadystatechange = function(){
 		if(this.readyState ===4 && this.status ===200){
 			let data = JSON.parse(this.responseText)
			   document.getElementById('positif-corona').innerHTML += data.result.positif;
			   document.getElementById('meninggal-corona').innerHTML += data.result.meninggal;
			   document.getElementById('dirawat-corona').innerHTML += data.result.dirawat;
			   document.getElementById('sembuh-corona').innerHTML += data.result.sembuh;
 		}
 	}
 	ajax.send();
 }
 load_quote();

// Visitor
function getvisitor(){
    var xhr = new XMLHttpRequest();
    var url = 'https://api.countapi.xyz/hit/api-alphabot.herokuapp.com/visits';
    xhr.onloadend = function(){
    data = JSON.parse(this.responseText);
    document.getElementById("visits").textContent = data.value
    };
    xhr.open("GET", url, true);
    xhr.send();
    }

// User Agent
txt = "";
txt += "<p><b>Version Browser</b>: <br>" + navigator.appVersion + "</p>";
txt += "<p><b>Language</b>: " + navigator.language + "</p>";
txt += "<p><b>Browser</b>: " + navigator.appCodeName + "</p>";
txt += "<p><b>Vendor</b>: " + navigator.vendor + "</p>";
txt += "<p><b>Browser Online</b>: " + navigator.onLine + "</p>";
txt += "<p><b>Cookies</b>: " + navigator.cookieEnabled + "</p>";
txt += "<p><b>Platform</b>: " + navigator.platform + "</p>";
txt += "<p><b>User Agent</b>: <br>" + navigator.userAgent + "</p>";

myMonths = ["Janeiro","Fevereiro","Março","Abril","Maio","Julho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
myDays = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
var tgl = new Date();
var day = tgl.getDate()
bulan = tgl.getMonth()
var thisDay = tgl.getDay(),
ThisDay = myDays[thisDay];
var yy = tgl.getYear()
var year = (yy < 1000) ? yy + 1900 : yy;

const tanggal = `${ThisDay}, ${day} - ${myMonths[bulan]} - ${year}`

document.getElementById("Years").innerHTML = year;
document.getElementById("Statistic").innerHTML = txt;
document.getElementById("tanggal").innerHTML = tanggal;

//ucapan Tiap Hari
Sayings = "";
			var now = new Date();
			var hours = now.getHours();
			if (hours >= 18 || hours <= 5){
			Sayings += "<span class='text-light'>Buenas noches. 🌚</span>"
			} else if (hours >= 5 && hours <= 12){
			Sayings += "<span class='text-info'>Buenos días. 🌝</span>"
			} else if (hours >= 12 && hours <= 17){
			Sayings += "<span class='text-warning'>Buenas tardes. 🌞</span>"
			} else if (hours >= 17 && hours <= 18){
			Sayings += "<span class='text-success'>Buenas tardes. 🌜</span>"
			}
document.getElementById("Ucapan").innerHTML = Sayings;

// Jam Sekarang
window.setTimeout("waktu()", 1000);
	function waktu() {
		var d = new Date();
  const jam = d.getHours();
  const menit = d.getMinutes();
  const detik = d.getSeconds();
		setTimeout("waktu()", 1000);
		document.getElementById("Clock").innerHTML = jam +" : "+ menit +" : "+ detik +" WIB";
	}

// Count Down Idul Adha
var countDownDate = new Date("July 19, 2021 00:00:00").getTime();

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
    
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  document.getElementById("IdulAdha").innerHTML = days + " Days " + hours + " Hours "
  + minutes + " Min " + seconds + " Sec ";
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("IdulAdha").innerHTML = "Selamat Hari Raya Idul Adha ";
  }
}, 1000);

var batteryLevel = document.getElementById("batteryLevel");
			var styleBatteryLevel = batteryLevel.style;
			var percentageLevel = document.getElementById("percentageLevel");
			navigator.getBattery().then(function(battery) {
			function updateAllBatteryInfo(){
			updateLevelInfo();
			}
			updateAllBatteryInfo();
			battery.addEventListener('levelchange',      function(){
			setInterval(function(){
			updateLevelInfo()
			},1000);
			});
			function updateLevelInfo(){
			var numBattery = battery.level * 100;
			percentageLevel.textContent=Math.round(numBattery) + "%";
			styleBatteryLevel.height=numBattery + "%";
			if(numBattery<=15) {
			styleBatteryLevel.background="red";
			}
			};
			});

	const Image = ["./../images/logo1.png","./../images/logo2.png","./../images/logo3.jpeg"]
	const randImage = Image[Math.floor(Math.random() * Image.length)];

(function($) {
  'use strict';
  $('#image')[0].src = randImage;

  $.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
  }
  $(function() {
    if ($("#currentBalanceCircle").length) {
      var bar = new ProgressBar.Circle(currentBalanceCircle, {
        color: '#000',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 12,
        trailWidth: 12,
        trailColor: '#0d0d0d',
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#d53f3a', width: 12 },
        to: { color: '#d53f3a', width: 12 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
      
          var value = Math.round(circle.value() * 100);
          circle.setText('');
      
        }
      });

      bar.text.style.fontSize = '1.5rem';
      bar.animate(0.4);  // Number from 0.0 to 1.0
    }
    if($('#audience-map').length) {
      $('#audience-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        panOnDrag: true,
        focusOn: {
          x: 0.5,
          y: 0.5,
          scale: 1,
          animate: true
        },
        series: {
          regions: [{
            scale: ['#3d3c3c', '#f2f2f2'],
            normalizeFunction: 'polynomial',
            values: {

              "BZ": 75.00,
              "US": 56.25,
              "AU": 15.45,
              "GB": 25.00,
              "RO": 10.25,
              "GE": 33.25
            }
          }]
        }
      });
    }
    if ($("#transaction-history").length) {
      var areaData = {
        labels: ["Paypal", "Stripe","Cash"],
        datasets: [{
            data: [55, 25, 20],
            backgroundColor: [
              "#111111","#00d25b","#ffab00"
            ]
          }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
      
          var text = "$1200", 
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.4;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "Total", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
              textsY = height / 1.7;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }
    if ($("#transaction-history-arabic").length) {
      var areaData = {
        labels: ["Paypal", "Stripe","Cash"],
        datasets: [{
            data: [55, 25, 20],
            backgroundColor: [
              "#111111","#00d25b","#ffab00"
            ]
          }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
      
          var text = "$1200", 
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.4;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "مجموع", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
              textsY = height / 1.7;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history-arabic").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }
    if ($('#owl-carousel-basic').length) {
      $('#owl-carousel-basic').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4500,
        navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
    var isrtl = $("body").hasClass("rtl");
    if ($('#owl-carousel-rtl').length) {
      $('#owl-carousel-rtl').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        rtl: isrtl,
        autoplay: true,
        autoplayTimeout: 4500,
        navText: ["<i class='mdi mdi-chevron-right'></i>", "<i class='mdi mdi-chevron-left'></i>"],
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
    });
})(jQuery);