import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

const updateInterval = "30000";

let draw = Chart.controllers.line.prototype.draw;
    Chart.controllers.line = Chart.controllers.line.extend({
        draw: function() {
            draw.apply(this, arguments);
            let ctx = this.chart.chart.ctx;
            let _stroke = ctx.stroke;
            ctx.stroke = function() {
                ctx.save();
                ctx.shadowColor = '#ccc';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;
                _stroke.apply(this, arguments)
                ctx.restore();
            }
        }
    });

Template.dashboard.onCreated(function onDashboardCreated(){
    this.gpList = new ReactiveVar([]);
    updateGPList(this);
    setInterval(()=>{updateGPList(this)},updateInterval);

    this.etappeData = new ReactiveVar([]);
    updateEtappeData(this);
    setInterval(()=>{updateEtappeData(this)},updateInterval);

    this.weatherData = new ReactiveVar([]);
    updateWeatherData(this);
    setInterval(()=>{updateWeatherData(this)},updateInterval);

    this.vehicleData = new ReactiveVar([]);
    updateVehicleData(this);
    setInterval(()=>{updateVehicleData(this)},updateInterval);
})

Template.dashboard.onRendered(function onDashboardRendered(){
    $('#webticker-dark-icons').webTicker();
});

const updateGPList = (templateInstance)=>{
    if(Session.get('cookie')){
        Meteor.call(
            'getGPData',
            Session.get('cookie'),
            (err,res)=>{
                templateInstance.gpList.set(res);
            });
    }
}

const updateVehicleData = (templateInstance)=>{
    if(Session.get('cookie')){
    Meteor.call(
        'getVehicleStatus',
        Session.get('cookie'),
        (err,res)=>{
            templateInstance.vehicleData.set(res);
        });
    }
}

const updateEtappeData = (templateInstance)=>{
    if(Session.get('cookie')){
    Meteor.call(
        'getEtappeInfo',
        Session.get('cookie'),
        (err,res)=>{
            templateInstance.etappeData.set(res);
            if (res) {
                $("#lopers-chart").empty();
                new Morris.Bar({
                  element: 'lopers-chart',
                  data:    res,
                  xkey:    'x',
                  ykeys:   ['y'],
                  labels:  ['Lopers'],
                  resize:  true
                });
              }
        });
    }
}

const updateWeatherData = (templateInstance)=>{
    if(Session.get('cookie')){
    Meteor.call(
        'getWeatherData',
        (err,res)=>{
            templateInstance.weatherData.set(res);
            if (res) {
                $("#weather-size-monitor").empty();
                let newCanvas = $('<canvas/>',{
                     id: 'weather-chart'                   
                 });
                $("#weather-size-monitor").append(newCanvas);
                var ctx = $('#weather-chart');
                var mixedChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [{
                            label: 'Percipation',
                            data: res.percipation.slice(0,12),
                            backgroundColor: "rgba(113, 216, 117, 0)", 
                            borderWidth: 3,
                            borderColor: "#00aff0",
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#00aff0",
                            pointHoverBackgroundColor: "#FFF",
                            pointHoverBorderColor: "#00aff0",
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: true
                        }, {
                            label: 'Temperature',
                            data: res.temperature.slice(0,12),
                            backgroundColor: "rgba(100, 23, 45, .0)", 
                            borderWidth: 3,
                            borderColor: "#ff5274",
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#ff5274",
                            pointHoverBackgroundColor: "#FFF",
                            pointHoverBorderColor: "#ff5274",
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            fill: true,
                            // Changes this dataset to become a line
                            type: 'line'
                        }],
                        labels: res.labels.slice(0,12)
                    },
                    options: {
                        responsive: !0,
                        maintainAspectRatio: false,
                        legend: {
                            display: !1
                        },
                        animation: {
                            duration: 0
                        },
                        scales: {
                            xAxes: [{
                                display: false,
                                gridLines: {
                                    display: false, 
                                    drawBorder: false
                                }
                            }],
                            yAxes: [{
                                display: true,
                                ticks: {
                                    padding: 5,
                                    stepSize: 5,
                                    // max: 30,
                                    min: 0
                                },
                                gridLines: {
                                    display: true,
                                    draw1Border: !1,
                                    lineWidth: 0.5,
                                    zeroLineColor: "transparent",
                                    drawBorder: false
                                }
                            }]
                        }
                    }
                });
              }
        });
    }
}

Template.dashboard.helpers({
    newTicketCount(){
        return Tickets.find({status:'Open', owner:{$exists:false}, parent:{$exists:false}}).count()
    },
    highTicketCount(){
        return Tickets.find({status:'Open', owner:{$exists:true}, priority:2, parent:{$exists:false}}).count()
    },
    normalTicketCount(){
        return Tickets.find({status:'Open', owner:{$exists:true}, priority:1, parent:{$exists:false}}).count()
    },
    lowTicketCount(){
        return Tickets.find({status:'Open', owner:{$exists:true}, priority:0, parent:{$exists:false}}).count()
    },
    closedTicketCount(){
        return Tickets.find({status:'Gesloten'}).count()
    },
    gpList(){
        if(Template.instance().gpList){
            let gps = Template.instance().gpList.get()
            for (const gp of gps) {
                const timeLeft = moment(gp.planned).diff(moment(), 'minutes')
                if (timeLeft < 20){
                    gp.background = "gp-card-warning"
                }
                if (timeLeft < 10){
                    gp.background = "gp-card-danger"
                }
                if (gp.status == 'beveiligd' || gp.status == 'geopend'){
                    gp.background = "gp-card-done"
                }
            }
            return gps
        }
    },
    etappeData(){
        if(Template.instance().etappeData){
            return Template.instance().etappeData.get()
        }
    },
    weatherData(){
        if(Template.instance().weatherData){
           const weather = Template.instance().weatherData.get();
           if(weather){
            return {
                temperature:weather.current.temperature.toFixed(1),
                uvIndex:weather.current.uvIndex,
                humidity:(weather.current.humidity*100).toFixed(0),
             }
           }
        }
    },
    vehicleData(){
        if(Template.instance().vehicleData){
            let vehicles = Template.instance().vehicleData.get();
            for (const vehicle of vehicles) {
                if(vehicle.status.value == 'inzetbaar'){
                    vehicle.status.flag = false;
                    vehicle.status.class = 'success';
                }else{
                    const timestamp = moment(vehicle.status.time);
                    vehicle.status.timeElapsed = moment().diff(timestamp, 'minutes');
                    if(vehicle.status.timeElapsed > 15){
                        vehicle.status.flag = true;
                        vehicle.status.class = 'danger';
                    }else{
                        vehicle.status.flag = true;
                        vehicle.status.class = 'warning';
                    }
                }
            }
           return vehicles;
        }
    },
    currentTime: function() {
        return Chronos.moment().format('HH:mm:ss');
    }
});