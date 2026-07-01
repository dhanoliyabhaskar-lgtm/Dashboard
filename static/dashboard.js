let ctx = document.getElementById("activityChart").getContext("2d")
new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Events attended",
                data: [5, 4, 8, 2, 4, 1, 3],
            },
            {
                label: "Time Spend On Github (min)",
                data: [12, 19, 15, 14, 19, 16, 20],
            },
            {
                label: "Time Spend On Leetcode (min)",
                data: [35, 36, 33, 31, 30, 38, 33],
            },
            {
                label: "Songs Played",
                data: [22, 21, 28, 27, 25, 28, 27],
            },
        ],
    },

    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});