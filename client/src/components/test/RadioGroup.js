import React, {Component} from 'react';

class RadioGroup extends Component {
    constructor() {
        super();
        this.renderChildren = this.renderChildren.bind(this)
    }

    renderChildren() {
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                name: this.props.name
            })
        })
    }

    render() {
        return (
            <div className="group">
                {this.renderChildren()}
            </div>
        );
    }
}

export default RadioGroup;