const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const analyticsheader = document.querySelector('.analytics-header')
const analyticsheaderp = document.querySelector('.analytics-header p')
const allbox = document.querySelectorAll('.card, .tabs button, .box, #box-1, #item-1, #item-2')
const activetab = document.querySelector('.tabs .active')

// HTML ke data attribute se value nikalna
const user = JSON.parse(document.body.dataset.user);

const calender = user.calender;

const hoursarr = calender && calender.scheduletime ? calender.scheduletime : null;

let valuesarray = [];
let datesarray = [];

for (let i = 0; i < hoursarr.length; i++) {
    valuesarray[i] = hoursarr[i].value;
    datesarray[i] = hoursarr[i].at;
}

let reversevalues = valuesarray.reverse(); //reversing the array 
let reverseat = datesarray.reverse(); //reversing the array

const busy = calender && calender.mostbusydays ? calender.mostbusydays : null;

for (let i = 0; i < busy.length; i++) {
    valuesarray[i] = busy[i].value;
    datesarray[i] = busy[i].at;
}

let reversevalues1 = valuesarray.reverse(); //reversing the array 
let reverseat1 = datesarray.reverse(); //reversing the array


const currentTheme = user.theme;

console.log("Current Theme Value from HTML attribute:", currentTheme);

if (currentTheme == 2) {
    wholebody.style.backgroundColor = 'rgb(40, 40, 57)';
    box.style.backgroundColor = 'rgb(28, 30, 36)';
    wholebody.style.color = 'white';
    sidebar.style.backgroundColor = 'rgb(40, 40, 57)';
    sidebarbutton.forEach(button => {
        button.style.backgroundColor = "rgb(28, 30, 36)";
        button.style.color = "white";
    });
    whiteicon.forEach(icon => {
        icon.style.display = "block";
    });
    blackicon.forEach(icon => {
        icon.style.display = "none";
    });
    activesidebarbutton.style.backgroundColor = '#3a4ccd';
    activesidebarbutton.style.color = 'white';
    analyticsheader.style.backgroundColor = 'rgb(28, 30, 36)';
    analyticsheader.style.color = 'white';
    analyticsheaderp.style.color = 'rgb(219, 216, 216)';
    allbox.forEach(box => {
        box.style.backgroundColor = 'rgb(28, 30, 36)';
        box.style.color = 'white';
    });
    activetab.style.backgroundColor = '#5c54ff';


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
            categories: reverseat,
            labels: {
                style: {
                    colors: 'white'
                }
            }
        },

        title: {
            text: "Hours Scheduled Over Time",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white',
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
                style: {
                    colors: 'white'
                }
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


    var hbar = {
        chart: {
            type: 'bar',
            height: 242,
        },

        series: [
            {
                name: "Busy Hours",
                data: reversevalues1
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
                color: 'white',
            }
        },

        xaxis: {
            categories: reverseat1,
            labels: {
                style: {
                    colors: 'white'
                }
            }
        },

        yaxis: {
            labels: {
                style: {
                    colors: 'white'
                }
            }
        },

        colors: ['#3e6afb'],

        grid: {
            show: false
        },

        tooltip: {
            theme: 'light'
        }
    };


    var donut = {
        chart: {
            type: 'donut',
            height: '247',
            toolbar: {
                show: true,
            },
        },

        series: [(calender.todaybusy.busy.hr) * 60 + calender.todaybusy.busy.min, (calender.todaybusy.free.hr) * 60 + calender.todaybusy.free.min],

        labels: ['Busy Time', 'Free Time'],

        title: {
            text: "Busy Vs Free Time (Today)",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white',
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
            labels: {
                colors: "white"
            },
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
} else {
    wholebody.style.backgroundColor = 'rgb(219, 237, 245)';
    box.style.backgroundColor = 'rgb(255, 255, 255)';
    wholebody.style.color = 'rgb(0, 0, 0)';
    sidebar.style.backgroundColor = 'white';
    sidebarbutton.forEach(button => {
        button.style.backgroundColor = "white";
        button.style.color = "rgb(28, 30, 36)";
    });
    whiteicon.forEach(icon => {
        icon.style.display = "none";
    });
    blackicon.forEach(icon => {
        icon.style.display = "block";
    });
    activesidebarbutton.style.backgroundColor = '#3a4ccd';
    activesidebarbutton.style.color = 'white';
    analyticsheader.style.backgroundColor = 'white';
    analyticsheader.style.color = 'rgb(28, 30, 36)';
    analyticsheaderp.style.color = '#777';
    allbox.forEach(box => {
        box.style.backgroundColor = 'white';
        box.style.color = 'black';
    });
    activetab.style.backgroundColor = '#5c54ff';


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


    var hbar = {
        chart: {
            type: 'bar',
            height: 242,
        },

        series: [
            {
                name: "Busy Hours",
                data: reversevalues1
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
            categories: reverseat1
        },

        colors: ['#3e6afb'],

        grid: {
            show: false
        },

        tooltip: {
            theme: 'light'
        }
    };


    var donut = {
        chart: {
            type: 'donut',
            height: '247',
            toolbar: {
                show: true,
            },
        },

        series: [(calender.todaybusy.busy.hr) * 60 + calender.todaybusy.busy.min, (calender.todaybusy.free.hr) * 60 + calender.todaybusy.free.min],

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
}




var chartElement = document.querySelector("#box-1");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();

var horzbar = document.querySelector("#item-1")
var chart2 = new ApexCharts(horzbar, hbar);
chart2.render();

var chartspace = document.querySelector("#item-2");
var chart3 = new ApexCharts(chartspace, donut);
chart3.render();



if (currentTheme == 2) {
    setTimeout(() => {
        const toolbars = document.querySelectorAll(".apexcharts-toolbar, .apexcharts-menu-icon");
        toolbars.forEach(toolbar => {
            toolbar.style.backgroundColor = "rgb(40,40,57)";
        }, 100);
    })
}


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