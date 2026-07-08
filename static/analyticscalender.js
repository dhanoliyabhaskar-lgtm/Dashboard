// chart1 css

var options = {
    chart: {
        type: 'area',
        height: 250,
        width: 430,
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
    }
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
        align: 'start'
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

    series: [9*60+30, 5*60+30],

    labels: ['Busy Time', 'Free Time'],

    title: {
        text: "Busy Vs Free Time (Today)",
        align: 'left',
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
        position: 'right',
        offsetY: 90,
        offsetX: 5,
        fontSize: '13px',
        markers: {
           offsetX: -5
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