import React, {Component} from 'react';

class Executioner extends Component {
    render() {
        return this.props.children()
    }
}

export default Executioner;