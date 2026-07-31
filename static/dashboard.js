const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const overviewheader = document.querySelector('.overview-header')
const overviewheaderp = document.querySelector('.overview-header p')
const whitenotifications = document.querySelector('.notifications-white-icon')
const blacknotifications = document.querySelector('.notifications-black-icon')
const allbox = document.querySelectorAll('.card, .weekly-activity, .donut, .events, .aisummary')

// HTML ke data attribute se value nikalna
const user = JSON.parse(document.body.dataset.user);

const currentTheme = user.theme;
console.log("Current Theme Value from HTML attribute:", currentTheme);

var options;
var donut;

const languagename = Object.keys(user.github.language);
const languagevalues = Object.values(user.github.language);
let newvalues = [];

for (let i = 0; i < languagevalues.length; i++) {
    newvalues[i] = Math.floor(languagevalues[i] / (1024));
}

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
    overviewheader.style.backgroundColor = 'rgb(28, 30, 36)';
    overviewheader.style.color = 'white';
    overviewheaderp.style.color = 'rgb(219, 216, 216)';
    allbox.forEach(box => {
        box.style.backgroundColor = 'rgb(28, 30, 36)';
    });
    blacknotifications.style.display = 'none';

    options = {
        chart: {
            type: 'area',
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
            categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            labels: {
                style: {
                    colors: "white"
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "white"
                }
            }
        },
        title: {
            text: "Weekly Activity Overview",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white',
            }
        },
        legend: {
            labels: {
                colors: "white"
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
    
    donut = {
        chart: {
            type: 'donut',
            height: '250',
            toolbar: {
                show: true,
            },
        },

        series: newvalues,

        labels: languagename,

        title: {
            text: "Most Used Language",
            align: 'left',
            style: {
                fontSize: "15px",
                color: 'white',
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
                            color: "white",
                            fontSize: "15px",
                            fontWeight: 'bold',
                            formatter: function (val) {
                                return Math.round(val) + " KB";
                            }
                        },
                    }
                },
            }
        },

        legend: {
            show: true,
            labels: {
                colors: "white"
            },
            position: "right",
            horizontalAlign: "center",
            fontSize: "14px",
            offsetY: 70,
            offsetX: 40,
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
    overviewheader.style.backgroundColor = 'white';
    overviewheader.style.color = 'rgb(28, 30, 36)';
    overviewheaderp.style.color = '#777';
    allbox.forEach(box => {
        box.style.backgroundColor = 'white';
    });
    whitenotifications.style.display = 'none';

    options = {
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
    };
    donut = {
        chart: {
            type: 'donut',
            height: '250',
            toolbar: {
                show: true,
            },
        },

        series: newvalues,

        labels: languagename,

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
                                return Math.round(val) + " KB";
                            }
                        },
                    }
                },
            }
        },

        legend: {
            show: true,
            position: "right",
            horizontalAlign: "center",
            fontSize: "14px",
            offsetY: 70,
            offsetX: 40,
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
}



var chartElement = document.querySelector("#activityChart");
var chart = new ApexCharts(chartElement, options);
chart.render();

var chartspace = document.querySelector("#chart");
var chart2 = new ApexCharts(chartspace, donut);
chart2.render();


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

