import React, { Component } from 'react';

class Grid extends Component {
    render() {
        return (
            <ul>{this.props.children}</ul>
        );
    }
}

export default Grid;