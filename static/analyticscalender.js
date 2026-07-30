const calender = JSON.parse(document.body.dataset.calender);

const hoursarr = calender && calender.scheduletime ? calender.scheduletime : null;
//const maindata = Array.isArray(hours) ? hours[0] : hours; 
//
//const hoursarray = maindata ? Object.values(maindata) : []; // convert the object into an array 
//
//let valuesarray = hoursarray.map(item => item.value); // taking the values of the array in an another array
//let datesarray = hoursarray.map(item => item.at); // taking the values of the array in an another array
//
//let reversevalues = valuesarray.reverse(); //reversing the array 
//let reverseat = datesarray.reverse(); //reversing the array

let valuesarray = [];
let datesarray = [];

for(let i=0 ; i<hoursarr.length ; i++){
    valuesarray[i] = hoursarr[i].value;
    datesarray[i] = hoursarr[i].at;
}

let reversevalues = valuesarray.reverse(); //reversing the array 
let reverseat = datesarray.reverse(); //reversing the array

// chart1 css
var options = {
    chart: {
        type: 'area',
        height: 250,
    },

    series: [
        {
            name: 'Hours In Events',
            data: reversevalues
        }
    ],

    xaxis: {
        categories: reverseat
    },

    title: {
        text: "Hours Scheduled Over Time",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    subtitle: {
        text: "Hours of events per day",
        align: 'left',
        offsetY: 20,
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'grey'
        }
    },

    yaxis: {
        labels: {
            offsetX: -15,
        }
    },

    grid: {
        padding: {
            left: -3,
        }
    },

    responsive: [{
        breakpoint: 350,
        options: {
            chart: {
                height: '260px',
            },
            title: {
                style: {
                    fontSize: "12px"
                }
            }
        }
    }],

    responsive: [{
        breakpoint: 700,
        options: {
            chart: {
                height: '260px',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    }
                }
            }
        }
    }]
}

var chartElement = document.querySelector("#box-1");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();

const busy = calender && calender.mostbusydays ? calender.mostbusydays : null;
//const Maindata = Array.isArray(busy) ? busy[0] : busy; 
//
//const busyarray = Maindata ? Object.values(Maindata) : []; // convert the object into an array 
//
//valuesarray = busyarray.map(item => item.value); // taking the values of the array in an another array
//datesarray = busyarray.map(item => item.at); // taking the values of the array in an another array

for(let i=0 ; i<busy.length ; i++){
    valuesarray[i] = busy[i].value;
    datesarray[i] =busy[i].at;
}

reversevalues = valuesarray.reverse(); //reversing the array 
reverseat = datesarray.reverse(); //reversing the array

// chart2 css

var hbar = {
    chart: {
        type: 'bar',
        height: 242,
    },

    series: [
        {
            name: "Busy Hours",
            data: reversevalues
        }
    ],

    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 5,
            barHeight: '60%'
        }
    },

    title: {
        text: "Most Busy Days",
        align: 'start',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    xaxis: {
        categories: reverseat,
        color: 'black',
    },

    colors: ['#3e6afb'],

    grid: {
        show: false
    },

    tooltip: {
        theme: 'light'
    }
};

var horzbar = document.querySelector("#item-1")
var chart2 = new ApexCharts(horzbar, hbar);
chart2.render();



// chart3 css

var donut = {
    chart: {
        type: 'donut',
        height: '247',
        toolbar: {
            show: true,
        },
    },

    series: [(calender.todaybusy.busy.hr)*60 + calender.todaybusy.busy.min, (calender.todaybusy.free.hr)*60 + calender.todaybusy.free.min],

    labels: ['Busy Time', 'Free Time'],

    title: {
        text: "Busy Vs Free Time (Today)",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    subtitle: {
        text: " Your 8hrs sleep time is not included",
        align: 'left',
        offsetY: 20,
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'grey'
        }
    },

    plotOptions: {
        pie: {
            donut: {
                size: '52%'
            },
        }
    },

    legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
    },

    dataLabels: {
        style: {
            fontSize: "14px",
            fontWeight: 600
        },
        formatter: function (val) {
            return Math.round(val) + "%";
        }
    },

    tooltip: {
        y: {
            formatter: function (value) {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return hours + "h " + minutes + "m";
            }
        }
    }
}

const schedulearr = calender.todayschedule ? Object.values(calender.todayschedule) : [];
console.log(schedulearr);
if(schedulearr.length>0){
    
}

var chartspace = document.querySelector("#item-2");
var chart3 = new ApexCharts(chartspace, donut);
chart3.render();









function roggle() {
    let sidebar = document.querySelector('.sidebar');
    let logo = document.querySelector('.sidebar .logo');

    if (sidebar.style.display != 'none') {
        sidebar.style.display = 'none';
    } else {
        sidebar.style.display = 'block';
        sidebar.style.width = '70vw';
        sidebar.style.position = 'fixed';
        sidebar.style.zIndex = '11';
        sidebar.style.height = '100vh';
        logo.style.visibility = 'hidden';
    }
};

function moggle() {
    if (window.innerWidth <= 1400) {
        let sidebars = document.querySelector('.sidebar');
        if (sidebars.style.display != 'none') {
            sidebars.style.display = 'none';
        }
    }
}