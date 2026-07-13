
var options = {
    chart: {
        type: 'area',
        // height: 320,
        // width: 530,
    },
    series: [
        {
            name: 'Events attended',
            data: [5, 4, 8, 2, 4, 1, 3]
        },
        {
            name: 'Time Spend On Github (min)',
            data: [12, 19, 15, 14, 19, 16, 20]
        },
        {
            name: 'Time Spend On Leetcode (min)',
            data: [35, 36, 33, 31, 30, 38, 33]
        },
        {
            name: 'Songs Played',
            data: [22, 21, 28, 27, 25, 28, 27]
        }
    ],
    xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    title: {
        text: "Weekly Activity Overview",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black',
        }
    },

    responsive: [{
        breakpoint: 650,
        options: {
            chart: {
                height: 400,
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
                            fontSize: '10px'
                        }
                    }
                },

                yaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },

                legend: {
                    position: 'bottom',
                    fontSize: '11px',
                    horizontalAlign: 'center',
                    offsetY: 5,
                    markers: {
                        width: 8,
                        height: 8
                    }
                },

                dataLabels: {
                    enabled: true
                }
            }
        },
    },

    {
        breakpoint: 480,
        options: {
            chart: {
                height: 350
            },
            legend: {
                show: true,
                fontSize: '9px'
            },
            dataLabels: {
                enabled: false
            }
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
}

var chartElement = document.querySelector("#activityChart");
var chart = new ApexCharts(chartElement, options);
chart.render();



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
    let sidebars = document.querySelector('.sidebar');
    if (sidebars.style.display != 'none') {
        sidebars.style.display = 'none';
    }
}
