// chart1 css

const options = {
    series: [{
        name: "Commits",
        data: [8, 3, 5, 12, 15, 21, 23, 31, 16, 6, 8, 36, 24, 29, 18, 22, 12, 19, 16, 31, 25, 5, 11, 8, 13, 20, 23, 13, 10, 17]
    }],

    chart: {
        type: "area",
        height: 300,
    },

    xaxis: {
        categories: [
            "Jun 1", "Jun 2", "Jun 3", "Jun 4", "Jun 5",
            "Jun 6", "Jun 7", "Jun 8", "Jun 9", "Jun 10",
            "Jun 11", "Jun 12", "Jun 13", "Jun 14", "Jun 15",
            "Jun 16", "Jun 17", "Jun 18", "Jun 19", "Jun 20",
            "Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25",
            "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30"
        ],

        labels: {
            rotate: 0,
            hideOverlappingLabels: true,
            style: {
                fontSize: "11px"
            }
        },

        axisBorder: {
            show: false
        },

    },

    title: {
        text: "Commit Activity",
        align: "left",
        style: {
            fontSize: "15px",
            color: 'black'
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
                },

            }
        },
    },

    {
        breakpoint: 500,
        options: {
            
        }
    },
        // {
        //     breakpoint: 1200,
        //     options: {
        //         chart: {
        //             height: 450
        //         },
        //     }
        // }
    ]

};

var chartElement = document.querySelector("#commitChart");
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

    series: [50, 30, 20],

    labels: ['Cpp', 'Python', 'Java'],

    title: {
        text: "Most Used Language",
        align: 'left',
        style: {
            fontSize: "15px",
            color: 'black',
        }
    },

    plotOptions: {
        pie: {
            donut: {
                size: '55%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: "15px",
                        fontWeight: 'bold'
                    },
                    value: {
                        show: true,
                        fontSize: "15px",
                        fontWeight: 'bold',
                        formatter: function (val) {
                            return Math.round(val) + "%";
                        }
                    },
                }
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
        enabled: true,
        style: {
            fontSize: "14px",
            fontWeight: 600
        },
        formatter: function (val) {
            return Math.round(val) + "%";
        }
    },

    tooltip: {
        enabled: false,
    },
}

var chartspace = document.querySelector("#languageChart");
var chart2 = new ApexCharts(chartspace, donut);
chart2.render();





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
