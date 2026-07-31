const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const analyticsheader = document.querySelector('.analytics-header')
const analyticsheaderp = document.querySelector('.analytics-header p')
const allbox = document.querySelectorAll('.card, .tabs button, #chart1, .widget')
const activetab = document.querySelector('.tabs .active')
const tableheading = document.querySelectorAll('table th')

// HTML ke data attribute se value nikalna
const user = JSON.parse(document.body.dataset.user);

var options

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
    tableheading.forEach(th => {
        th.style.color = 'white';
    });

    options = {
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
            categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            labels: {
                style: {
                    colors: "white"
                }
            }
        },

        title: {
            text: "Listening Time over Week (hrs)",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white'
            }
        },

        yaxis: {
            labels: {
                offsetX: -15,
                style: {
                    colors: "white"
                }
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
    analyticsheader.style.color = '#777';
    allbox.forEach(box => {
        box.style.backgroundColor = 'white';
        box.style.color = 'black';
    });
    activetab.style.backgroundColor = '#5c54ff';
    tableheading.forEach(th => {
        th.style.color = 'rgb(14, 14, 14)';
    });



    options = {
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
                offsetX: -15
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

}



var chartElement = document.querySelector("#chart1");
var chart = new ApexCharts(chartElement, options);
chart.render();


if (currentTheme == 2) {
    setTimeout(() => {
        const toolbars = document.querySelectorAll(".apexcharts-toolbar");
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