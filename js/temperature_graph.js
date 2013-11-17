function TemperatureGraph() {
  var graph;
      graphData = [],
      time = 0,
      timeStep = 1/60,
      graphOptions = {
        title:  "Un-calibrated Temperature data",
        xlabel:  "Time (s)",
        ylabel: "Max Value from AnalyserNode.getByteTimeDomainData()",
        xmax:   60,
        xmin:   0,
        ymax:   300,
        ymin:   120,
        xTickCount: 4,
        yTickCount: 5,
        xFormatter: ".3r",
        yFormatter: ".3r",
        realTime: true,
        fontScaleRelativeToParent: true
      };

  this.setup = function () {
    graphData = [[0]];
    dataIndex = 0;
    graphOptions.dataset = graphData;
    if (graph) {
      graph.reset('#graph', graphOptions);
    } else {
      graph = Lab.grapher.Graph('#graph', graphOptions);
    }
  }

  this.addPoint = function(value){
    // graph.addPoint(updateGraphData(props));
    graph.addPoint([time, value]);
    time += timeStep;
  };
}
