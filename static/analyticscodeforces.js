// chart1 css

var options = {
    chart: {
        type: 'area',
    },

    series: [
        {
            name: 'Rating',
            data: [2, 48, 95, 143, 262, 413, 578, 732, 879, 919, 1013, 1100, 1173, 1220, 1263]
        }
    ],

    xaxis: {
        categories: ["12Mar", "17Mar", "20Mar", "21Mar", "28Mar", "02Apr", "05Apr",
            "06Apr", "17Apr", "28Apr", "5May", "14May", "22May", "03Jun", "17Jun"],

        labels: {
            rotate: 0,
            hideOverlappingLabels: true,
            style: {
                fontSize: "11px"
            }
        },

    },

    title: {
        text: "Rating History",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    dataLabels: {
        enabled: false,
    },

    responsive: [{
        breakpoint: 700,
        options: {
            chart: {
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
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '15px'
                        }
                    }
                }

            }
        }
    }],
}

var chartElement = document.querySelector("#box-1");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();



// chart2 css

var donut = {
    chart: {
        type: 'donut',
        height: '290',
        toolbar: {
            show: true,
        },
    },

    series: [52, 20, 43, 37],

    labels: ['Dp', 'Maths', 'Greedy', 'Its'],

    title: {
        text: "Topics Solved",
        align: 'left',
        style: {
            fontSize: "15px",
            color: 'black',
        }
    },

    plotOptions: {
        pie: {
            donut: {
                size: '55%'
            }
        }
    },

    legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
    },

    tooltip: {
        y: {
            formatter: function (val) {
                return val + " Topics Solved";
            }

        }

    }
}

var chartspace = document.querySelector("#box-2");
var chart2 = new ApexCharts(chartspace, donut);
chart2.render();




// chart3 css

var option = {
    chart: {
        type: 'bar',
        height: "280px"
    },

    series: [
        {
            name: 'Problems Solved',
            data: [65, 147, 114, 31],
        }
    ],

    xaxis: {
        categories: ["800", "1000", "1200", "1500+"]
    },

    title: {
        text: "Problem Difficulty Vs Count",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    plotOptions: {
        bar: {
            distributed: true,
            borderRadius: 10,
            columnWidth: "42%",
            borderRadiusApplication: "end",
        }
    },

    colors: ["#FF6B6B", "#7C83FD", "#4D96FF", "#43AA8B"],

    legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
    },

}

var chartelement = document.querySelector("#box-3");
var chart3 = new ApexCharts(chartelement, option);
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
