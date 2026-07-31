const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const analyticsheader = document.querySelector('.analytics-header')
const analyticsheaderp = document.querySelector('.analytics-header p')
const allbox = document.querySelectorAll('.card, .tabs button, .box, .filter, .table')
const activetab = document.querySelector('.tabs .active')
const tableheading = document.querySelector('table th')
const wrongbox = document.querySelectorAll('.wrong')

// HTML ke data attribute se value nikalna
const user = JSON.parse(document.body.dataset.user);

const codeforces = user.codeforces;

const arr = codeforces.wronganswers ? Object.values(codeforces.wronganswers) : [];
console.log(arr);

const history = codeforces && codeforces.ratinghistory ? codeforces.ratinghistory : null;


var options;
var option;
var donut

let valuesarray = [];
let datesarray = [];

for (let i = 0; i < history.length; i++) {
    valuesarray[i] = history[i].value;
    datesarray[i] = history[i].at;
}

let reversevalues = valuesarray.reverse(); //reversing the array 
let reverseat = datesarray.reverse(); //reversing the array 


const topic = codeforces && codeforces.topics ? codeforces.topics : {};

let namesarr = Object.keys(topic);
let valuesarr = Object.values(topic);

let count = 0;

for (let i = 0; i < valuesarr.length; i++) {
    count = count + valuesarr[i];
}

let mincrit = count / 17;

console.log(mincrit);

let j = 0;

let newname = [];
let newvalue = [];

count = 0;

for (let i = 0; i < valuesarr.length; i++) {
    if (valuesarr[i] > mincrit) {
        newname[j] = namesarr[i];
        newvalue[j] = valuesarr[i];
        j++;
    } else {
        count = count + valuesarr[i]
    }
};

newname[j] = 'Others';
newvalue[j] = count;

const difficulty = codeforces && codeforces.difficulty ? codeforces.difficulty : null;


let namesarray = [];
let newvaluesarray = [];

for (let i = 0; i < difficulty.length; i++) {
    newvaluesarray[i] = difficulty[i].value;
    namesarray[i] = difficulty[i].name;
};

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
    wrongbox.forEach(wrong => {
        wrong.style.backgroundColor = 'rgb(40, 40, 57)';
    });

    options = {
        chart: {
            type: 'area',
        },

        series: [
            {
                name: 'Rating',
                data: reversevalues
            }
        ],

        xaxis: {
            categories: reverseat,

            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: {
                    fontSize: "11px",
                    colors: 'white'
                }
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
            text: "Rating History",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white',
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

    donut = {
        chart: {
            type: 'donut',
            height: '290',
            toolbar: {
                show: true,
            },
        },

        series: newvalue,

        labels: newname,

        title: {
            text: "Topics Solved",
            align: 'left',
            style: {
                fontSize: "15px",
                color: 'white',
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
            labels: {
                colors: "white"
            },
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

    option = {
        chart: {
            type: 'bar',
            height: "280px"
        },

        series: [
            {
                name: 'Problems Solved',
                data: newvaluesarray,
            }
        ],

        xaxis: {
            categories: namesarray,
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
            text: "Problem Difficulty Vs Count",
            align: 'left',
            style: {
                fontSize: "14px",
                color: 'white',
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
            labels: {
                colors: "white"
            },
            horizontalAlign: "center",
            fontSize: "14px",
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
    wrongbox.forEach(wrong => {
        wrong.style.backgroundColor = 'white';
    });

    options = {
        chart: {
            type: 'area',
        },

        series: [
            {
                name: 'Rating',
                data: reversevalues
            }
        ],

        xaxis: {
            categories: reverseat,

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

    donut = {
        chart: {
            type: 'donut',
            height: '290',
            toolbar: {
                show: true,
            },
        },

        series: newvalue,

        labels: newname,

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

    option = {
        chart: {
            type: 'bar',
            height: "280px"
        },

        series: [
            {
                name: 'Problems Solved',
                data: newvaluesarray,
            }
        ],

        xaxis: {
            categories: namesarray
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
}

var chartElement = document.querySelector("#box-1");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();

var chartspace = document.querySelector("#box-2");
var chart2 = new ApexCharts(chartspace, donut);
chart2.render();

var chartelement = document.querySelector("#box-3");
var chart3 = new ApexCharts(chartelement, option);
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