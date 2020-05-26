import React, {Component, Fragment} from 'react';

class RadioButton extends Component {
    render() {
        return (
            <Fragment>
                <input type="radio" value={this.props.value} name={this.props.name}/>
                {this.props.children}
            </Fragment>
        );
    }
}

export default RadioButton;