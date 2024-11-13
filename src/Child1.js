import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";
class Child1 extends Component {
  state = {
    company: "Apple",
    selectedMonth: "November",
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.csv_data !== this.props.csv_data ||
      prevState.company !== this.state.company ||
      prevState.selectedMonth !== this.state.selectedMonth
    ) {
      this.drawChart();
    }
  }
  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };
  drawChart() {
    const { csv_data } = this.props;
    const { company, selectedMonth } = this.state;
    d3.select("#chart").selectAll("*").remove();

    if (!csv_data || csv_data.length === 0) {
      console.log("No data available for drawing");
      return;
    }
    const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S%Z");
    const filteredData = csv_data
      .map((d) => ({
        Date: parseDate(d.Date),
        Open: parseFloat(d.Open),
        Close: parseFloat(d.Close),
        Company: d.Company,
      }))
      .filter(
        (d) =>
          d.Company === company &&
          d.Date &&
          d.Date.toLocaleString("default", { month: "long" }) === selectedMonth
      );
    if (filteredData.length === 0) {
      console.log("No matching data for selection");
      return;
    }
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      const x = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.Date))
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(10) 
          .tickFormat(d3.timeFormat("%a %d")) 
      )
      .selectAll("text")
      .attr("transform", "rotate(-45)") 
      .style("text-anchor", "end");

    const y = d3
      .scaleLinear()
      .domain([
        Math.floor(d3.min(filteredData, (d) => Math.min(d.Open, d.Close))/2)*2,
        Math.ceil(d3.max(filteredData, (d) => Math.max(d.Open, d.Close))/2)*2,
      ])
      .nice()
      .range([height, 0]);
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(10) 
          .tickFormat((d) => d) 
      );
    const lineOpen = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Open))
      .curve(d3.curveMonotoneX);
    const lineClose = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Close))
      .curve(d3.curveMonotoneX);
    svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 1.5)
      .attr("d", lineOpen);
    svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 1.5)
      .attr("d", lineClose);
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");
    svg
      .selectAll(".dot-open")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-open")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Open))
      .attr("r", 4)
      .attr("fill", "#b2df8a")
      .on("mouseover", function (event, d) {
        tooltip
          .html(
            `Date: ${d3.timeFormat("%m/%d/%Y")(d.Date)}<br>Open: ${d.Open.toFixed(
              2
            )}<br>Close: ${d.Close.toFixed(2)}<br>Difference: ${(
              d.Close - d.Open
            ).toFixed(2)}`
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
    svg
      .selectAll(".dot-close")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-close")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Close))
      .attr("r", 4)
      .attr("fill", "#e41a1c")
      .on("mouseover", function (event, d) {
        tooltip
          .html(
            `Date: ${d3.timeFormat("%m/%d/%Y")(d.Date)}<br>Open: ${d.Open.toFixed(
              2
            )}<br>Close: ${d.Close.toFixed(2)}<br>Difference: ${(
              d.Close - d.Open
            ).toFixed(2)}`
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
    svg
      .append("circle")
      .attr("cx", width - 100)
      .attr("cy", 10)
      .attr("r", 6)
      .style("fill", "#b2df8a");
    svg
      .append("text")
      .attr("x", width - 80)
      .attr("y", 15)
      .text("Open")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    svg
      .append("circle")
      .attr("cx", width - 100)
      .attr("cy", 30)
      .attr("r", 6)
      .style("fill", "#e41a1c");
    svg
      .append("text")
      .attr("x", width - 80)
      .attr("y", 35)
      .text("Close")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }
  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <div className="child1">
        <h1>Upload a CSV File</h1>
        <div>
          <h3>Select a Company:</h3>
          {options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                checked={this.state.company === option}
                onChange={this.handleCompanyChange}
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          <h3>Select a Month:</h3>
          <select
            value={this.state.selectedMonth}
            onChange={this.handleMonthChange}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div id="chart"></div>
      </div>
    );
  }
}
export default Child1;
