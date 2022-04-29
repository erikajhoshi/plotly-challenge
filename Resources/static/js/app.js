function buildData(ID) {

    d3.json("samples.json").then((Data) => {

        var filtered_Data = Data.metadata;

        var sample = filtered_Data.filter(item => item.id == ID);

        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });
    });
}

function buildCharts(ID) {

    d3.json("samples.json").then((Data) => {

        var filtered_Data = Data.samples;

        var sample_Dict = filtered_Data.filter(item => item.id == ID)[0];

        var sampleValues = sample_Dict.sample_values; 
        var barChartValues = sampleValues.slice(0, 10).reverse();

        var id_Values = sample_Dict.otu_ids;
        var barChartLabels = id_Values.slice(0, 10).reverse();

        var newLabels = [];
        barChartLabels.forEach((label) => {
            newLabels.push("OTU " + label);
        });

        var hovertext = sample_Dict.otu_labels;
        var barCharthovertext = hovertext.slice(0, 10).reverse();

        var barChartTrace = {
            type: "bar",
            y: newLabels,
            x: barChartValues,
            text: barCharthovertext,
            orientation: 'h'
        };

        var barChartData = [barChartTrace];

        Plotly.newPlot("bar", barChartData);


        var bubbleChartTrace = {
            x: id_Values,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: id_Values,
                size: sampleValues
            }
        };

        var bubbleChartData = [bubbleChartTrace];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubbleChartData, layout);
    });
}

function init() {

    d3.json("samples.json").then((Data) => {

        var filtered_Data = Data.names;

        var dropdownMenu = d3.select("#selDataset");

        filtered_Data.forEach((name) => {
            dropdownMenu.append("option").property("value", name).text(name);
        })

        buildData(filtered_Data[0]);

        buildCharts(filtered_Data[0]);

    });
}

function optionChanged(newID) {

    buildData(newID); 

    buildCharts(newID);
}

init();