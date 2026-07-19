// let ctx = document.getElementById("chart1").getContext("2d")
// new Chart(ctx, {
//     type: "line",
//     data: {
//         labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//         datasets: [
//             {
//                 label: "Listening Time (in hrs)",
//                 data: [8, 4, 6, 2, 4, 1, 7],
//             },
//         ],
//     },

//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     },
// });


var options = {
    chart: {
        type: 'area',
        height: 230,
    },

    series: [
        {
            name: 'Listening Time (in hrs)',
            data: [8, 4, 6, 2, 4, 1, 7]
        }
    ],

    xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },

    title: {
        text: "Listening Time over Week (hrs)",
        align: 'left',
        style: {
            fontSize: "14px",
            color: 'black'
        }
    },

    yaxis: {
        labels: {
            offsetX: -15,
        }
    },

    grid: {
        padding: {
            left: -5,
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

var chartElement = document.querySelector("#chart1");
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
    if (window.innerWidth <= 1400) {
        let sidebars = document.querySelector('.sidebar');
        if (sidebars.style.display != 'none') {
            sidebars.style.display = 'none';
        }
    }
}
