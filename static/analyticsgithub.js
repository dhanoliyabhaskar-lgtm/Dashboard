// chart1 css
const github = JSON.parse(document.body.dataset.github);

const commits = github && github.commitsovertime ? github.commitsovertime : null;
const maindata = Array.isArray(commits) ? commits[0] : commits; 

const commitsarray = maindata ? Object.values(maindata) : []; // convert the object into an array 

const valuesarray = commitsarray.map(item => item.value); // taking the values of the array in an another array
const datesarray = commitsarray.map(item => item.at); // taking the values of the array in an another array

const reversevalues = valuesarray.reverse(); //reversing the array 
const reverseat = datesarray.reverse(); //reversing the array 

const options = {
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

var chartElement = document.querySelector("#commitChart");
var chart1 = new ApexCharts(chartElement, options);
chart1.render();


const languagename = Object.keys(github.language);
const languagevalues = Object.values(github.language);
let newvalues =[];

for (let i=0 ; i<languagevalues.length ; i++){
    newvalues[i] = Math.floor(languagevalues[i]/(1024));
}


// chart2 css

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


const arr = github.repolist ? Object.values(github.repolist) : [];
console.log(arr);
