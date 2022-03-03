function buildData(ID) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var samples = data.samples;
        var filteredMetaData = metadata.filter(samplename => samplename.id == ID);
        var MetaData = filteredMetaData[0];
        var filteredSamples = samples.filter(samplename => samplename.id == ID);
        var Samples = filteredSamples[0];
        
        var otu_id = Samples.otu_id;
        var otu_labels = Samples.otu_labels;
        var sample_values = Samples.sample_values;

        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_id.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        
        let bar_data = [trace1]; 

        var bar_layout = {
            title: "Top 10 Microbial Species (OTUs) found in Individual Belly Button Samples",
            xaxis: {title: "OTU Sample Values"},
            yaxis: {title: "OTU ID Numbers"}
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        var trace2 = {
            x: otu_id,
            y: sample_values.slice(0, 10).reverse(),
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values.slice(0, 10).reverse(),
                color: otu_id
            }
        };

        let bubble_data = [trace2];

        var bubble_layout = {
            title: "Top 10 OTUs in Individual Belly Button Samples",
            xaxis: {title: "OTU ID Numbers"},
            yaxis: {title: "Sample Values"}
        };

        Plotly,newPlot("bubble", bubble_data, bubble_layout);
    });
}

function demographicInfo(ID) {
    var demoInfo = d3.select ("#sample-metadata");
    demoInfo.html("");
    d3.json("samples.json").then(data => {
        var metadata = data.metadata;
        var filteredMetaData = metadata.filter(samplename => samplename.id == ID);
        var MetaData = filteredMetaData[0];
        Object.entries(MetaData).forEach(([key, value]) => {
            demoInfo.append("h6").text(`${key}: ${value}`)
        })
    })
};

function init() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then((data) => {
        var IDs = data.names;
        IDs.forEach(ID => {
            dropdown.append("option").text(ID).property("value", ID)
        })
        buildData(IDs);
        demographicInfo(IDs);
    })
};

function optionChanged(newID) {
    buildData(newID);
    demographicInfo(newID)
};
    

init();


