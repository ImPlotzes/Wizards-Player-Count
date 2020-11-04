let chart;
function loader() {
    document.getElementById("update").addEventListener("click", updateChart)

    var ctx = document.getElementById('graph').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Player count',
                data: [],
                borderColor: "rgba(63, 191, 189, 0.29)",
                backgroundColor: "rgba(63, 191, 189, 0.06)",
                pointStyle: "crossRot"
            }]
        },
        options: {
            title: {
                display: true,
                text: "Loading..."
            },
            maintainAspectRatio: false,
            tooltips: {
                intersect: false
            },
            legend: {
                position: "bottom",
                align: "start"
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '# of players in Wizards'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (local)'
                    },
                    type: "time",
                    time: {
                        unit: "minute",
                        displayFormats: { minute: "HH:mm"},
                        tooltipFormat: "MMMM Do, HH:mm:ss",
                        stepSize: 5
                    }
                }]
            }
        }
    });
    updateChart();
}

async function updateChart() {
    document.getElementById("count").innerHTML = "Loading...";
    let apiHTML = await fetch("https://wizcount.plotzes.ml");
    apiHTML = await apiHTML.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(apiHTML, "text/html");
    const apiData = JSON.parse(doc.getElementsByTagName("pre")[0].innerHTML);
    const datacenter = doc.getElementsByTagName("h1")[0].innerHTML;
    chart.options.title.text = "History from datacenter " + datacenter;
    let newLabels = [];
    let newData = [];
    for(let i = 0; i < apiData.length; i++) {
        const point = apiData[i];
        newLabels.push(point.time);

        const formattedPoint = {
            x: new Date(point.time),
            y: point.count
        }
        newData.push(formattedPoint);
        if(i == apiData.length - 1) {
            document.getElementById("count").innerHTML = "Wizards had " + point.count + " players at " + formattedPoint.x.toLocaleTimeString();
        }
    }

    chart.data.labels = newLabels;
    chart.data.datasets[0].data = newData;
    console.log(JSON.stringify(newData, null, 2));
    chart.update();
}

window.onload = loader;