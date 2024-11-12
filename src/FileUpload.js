import React, { Component } from "react";
import Papa from "papaparse"; 

class FileUpload extends Component {
  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          this.props.onFileUpload(result.data);
        },
      });
    }
  };

  render() {
    return (
      <div className="file-upload">
        <input type="file" accept=".csv" onChange={this.handleFileChange} />
        <button onClick={() => document.querySelector('input[type="file"]').click()}>
          Upload
        </button>
      </div>
    );
  }
}

export default FileUpload;
