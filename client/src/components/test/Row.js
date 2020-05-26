import React, { Component } from 'react';

class Row extends Component {
    render() {
        return (
            <li>{this.props.itm}</li>
        );
    }
}

export default Row;