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
        Open: +d.Open,
        Close: +d.Close,
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
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
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

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => Math.min(d.Open, d.Close)),
        d3.max(filteredData, (d) => Math.max(d.Open, d.Close)),
      ])
      .nice()
      .range([height, 0]);
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("class", "x-axis")
      .style("color", "black"); 
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .attr("class", "y-axis")
      .style("color", "black"); 
    const lineOpen = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Open));

    const lineClose = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Close));
    svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2)
      .attr("d", lineOpen);
    svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2)
      .attr("d", lineClose);
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
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("opacity", 1)
          .html(
            `Date: ${d.Date.toDateString()}<br>Open: ${d.Open}<br>Close: ${d.Close}<br>Difference: ${(d.Close - d.Open).toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
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
      .attr("fill", "#e41a1c");
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 0)`);
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6)
      .style("fill", "#b2df8a");
    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 5)
      .text("Open")
      .style("fill", "black")
      .style("font-size", "12px");
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 20)
      .attr("r", 6)
      .style("fill", "#e41a1c");
    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 25)
      .text("Close")
      .style("fill", "black")
      .style("font-size", "12px");
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
        <div style={{ color: "black" }}>
          <h3>Select a Company:</h3>
          {options.map((option) => (
            <label key={option} style={{ marginRight: "10px" }}>
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
        <div style={{ color: "black", marginTop: "20px" }}>
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
        <div id="tooltip" className="tooltip" style={{ opacity: 0 }}></div>
      </div>
    );
  }
}
export default Child1;
