const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const analyticsheader = document.querySelector('.analytics-header')
const analyticsheaderp = document.querySelector('.analytics-header p')
const allbox = document.querySelectorAll('.card, .tabs button, #commitChart, #languageChart, .table-section')
const activetab = document.querySelector('.tabs .active')
const tableheading = document.querySelector('table th')

// HTML ke data attribute se value nikalna
const user = JSON.parse(document.body.dataset.user);

const github = user.github;

var options;
var donut;

const commits = github && github.commitsovertime ? github.commitsovertime : null;

let valuesarray = [];
let datesarray = [];

for (let i = 0; i < commits.length; i++) {
    valuesarray[i] = commits[i].value;
    datesarray[i] = commits[i].at;
};

const reversevalues = valuesarray.reverse(); //reversing the array 
const reverseat = datesarray.reverse(); //reversing the array 




const languagename = Object.keys(github.language);
const languagevalues = Object.values(github.language);
let newvalues = [];

for (let i = 0; i < languagevalues.length; i++) {
    newvalues[i] = Math.floor(languagevalues[i] / (1024));
}

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
    tableheading.style.color = 'white';

    options = {
        series: [{
            name: "Commits",
            data: reversevalues
        }],

        chart: {
            type: "area",
            height: 300,
        },

        xaxis: {
            categories: reverseat,

            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: {
                    fontSize: "18px",
                    colors: 'white'
                }
            },

            axisBorder: {
                show: false
            },

        },

        yaxis: {
            labels: {
                style: {
                    colors: "white"
                }
            }
        },

        title: {
            text: "Commit Activity",
            align: "left",
            style: {
                fontSize: "15px",
                color: 'white'
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

    var donut = {
        chart: {
            type: 'donut',
            height: '290',
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
    tableheading.style.color = 'rgb(14, 14, 14)';


    options = {
        series: [{
            name: "Commits",
            data: reversevalues
        }],

        chart: {
            type: "area",
            height: 300,
        },

        xaxis: {
            categories: reverseat,

            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: {
                    fontSize: "18px"
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

    donut = {
        chart: {
            type: 'donut',
            height: '290',
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


}


var chartElement = document.querySelector("#commitChart");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();

var chartspace = document.querySelector("#languageChart");
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


const arr = github.repolist ? Object.values(github.repolist) : [];
console.log(arr);