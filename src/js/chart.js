let fixedData;
const initPieChart = (data) => {
  //clear previous svg data.
  d3.selectAll("g").remove();
  //data conversion
  fixedData = [];
  for (let index = 0; index < Object.keys(data).length; index++) {
    fixedData.push({
      name: Object.keys(data)[index],
      value: Object.values(data)[index],
    });
  }
  const width = 300,
    height = 300,
    svg = d3.select("svg").attr("viewBox", [0, 0, width, height]),
    radius = Math.min(width, height) / 2 - 1,
    labelRadius = (Math.min(width, height) / 2) * 0.8,
    g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`),
    //Arranging color spectrum
    colors = d3
      .scaleOrdinal()
      .domain(fixedData.map((d) => d.name))
      .range(
        d3
          .quantize(
            (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
            fixedData.length
          )
          .reverse()
      ),
    pie = d3.pie().value((d) => d.value),
    arc = d3.arc().outerRadius(radius).innerRadius(0),
    arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  //creating pie pieces from arcs.
  const pies = g
    .selectAll(".arc")
    .data(pie(fixedData))
    .enter()
    .append("g")
    .attr("class", "arc");
  pies
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => colors(d.data.value));
  // uncomment these for transition effect
  // .transition()
  // .duration(function (d, i) {
  //   return i * 200;
  // })
  // .attrTween("d", function (d) {
  //   var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
  //   return function (t) {
  //     d.endAngle = i(t);
  //     return arc(d);
  //   };
  // });

  //adding text data on arcs
  pies
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pie(fixedData))
    .join("text")
    .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
    .attr("d", arcLabel)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text((d) => d.data.name)
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.data.value.toLocaleString())
    );
};

module.exports = initPieChart;
