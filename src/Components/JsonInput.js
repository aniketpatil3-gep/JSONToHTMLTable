import React, { Component } from 'react';

var full_table = '';
const stripJson = (obj, prefix = [], current = {}) => {
  if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      stripJson(obj[key], prefix.concat(key), current);
    }
  } else {
    current[prefix.join('.')] = obj;
  }
  return current;
};

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function buildHtmlTable(newjson) {
  full_table = '';
  var columns = addAllColumnHeaders(newjson);

  var mainData = '';

  for (var i = 0; i < newjson.length; i++) {
    var tabledata = '';
    // var temp_cell = '';
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = newjson[i][columns[colIndex]];
      if (cellValue == null) cellValue = '';

      tabledata += '<td>' + cellValue + '</td>';
    }
    mainData += '<tr>' + tabledata + '</tr>';
  }

  full_table += mainData + '</table>';
}

function addAllColumnHeaders(newjson) {
  var columnSet = [];
  var headerh = '';

  for (var i = 0; i < newjson.length; i++) {
    var rowHash = newjson[i];
    for (var key in rowHash) {
      if (!columnSet.includes(key)) {
        columnSet.push(key);
        key = key.replaceAll('_', ' ');
        key = key.replaceAll('.', ' / ');
        key = titleCase(key);
        headerh += '<th>' + key + '</th>';
      }
    }
  }

  full_table += '<table>' + '<tr>' + headerh + '</tr>';
  return columnSet;
}

export default class JsonInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    var newJson = [];
    var jsondata = JSON.parse(this.state.value);
    // var jsondata = [{ aniket: 'value' }];
    for (var i = 0; i < jsondata.length; i++) {
      newJson.push(stripJson(jsondata[i]));
    }
    console.log(newJson);
    buildHtmlTable(newJson);

    document.getElementById('output').innerHTML = full_table;
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            JSON Data:
            <textarea
              type='text'
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type='submit' value='Convert' />
        </form>
        <div id='output'></div>
      </div>
    );
  }
}
