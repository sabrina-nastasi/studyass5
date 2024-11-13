import React, { Component } from "react";
import FileUpload from "./FileUpload"; 
import Child1 from "./Child1"; 
import "./App.css"; 
class App extends Component {
  state = {
    csv_data: [] 
  };
  handleFileUpload = (csv_data) => {
    this.setState({ csv_data });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Upload a CSV File</h1>
          {/* File upload to accept CSV data */}
          <FileUpload onFileUpload={this.handleFileUpload} />
          {/* Child1 renders only if csv_data is available */}
          {this.state.csv_data.length > 0 && (
            <Child1 csv_data={this.state.csv_data} />
          )}
        </header>
      </div>
    );
  }
}
export default App;
