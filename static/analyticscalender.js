// chart1 css

var options = {
    chart: {
        type: 'area',
        height: 250,
    },

    series: [
        {
            name: 'Listening Time (in hrs)',
            data: [2, 7, 6, 3, 4, 1, 8]
        }
    ],

    xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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


// chart2 css

var hbar = {
    chart: {
        type: 'bar',
        height: 242,
    },

    series: [
        {
            name: "Busy Hours",
            data: [3, 4, 2, 3, 1, 6, 5]
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
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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

    series: [9 * 60 + 30, 5 * 60 + 30],

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
