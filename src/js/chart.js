const initPieChart = (data) => {
  //clear previous svg data.
  d3.selectAll("g").remove();
  //data conversion
  let fixedData = [];
  for (let index = 0; index < Object.keys(data).length; index++) {
    fixedData.push({
      name: Object.keys(data)[index],
      value: Object.values(data)[index],
    });
  }
  const svg = d3.select("svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = Math.min(width, height) / 2 - 1,
    labelRadius = (Math.min(width, height) / 2) * 0.8,
    g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .attr("stroke", "white"),
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
    path = d3.arc().outerRadius(radius).innerRadius(0),
    arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
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

  const pies = g
    .selectAll(".arc")
    .attr("stroke", "white")
    .data(pie(fixedData))
    .enter()
    .append("g")
    .attr("class", "arc");
  pies
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => colors(d.data.value));
};

module.exports = initPieChart;
