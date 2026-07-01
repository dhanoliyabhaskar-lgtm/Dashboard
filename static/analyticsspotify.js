let ctx = document.getElementById("chart1").getContext("2d")
new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Listening Time (in hours)",
                data: [5, 4, 8, 2, 4, 1, 3],
            }
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
