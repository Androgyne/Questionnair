import React, {Component} from 'react';

class Select extends Component {

    handleChange = (e) => {
        const {
            onChange,
        } = this.props;
        if (onChange) {
            onChange(e);
        };
    }

    render() {
        const {
            name,
            value,
            options,
        } = this.props;
        return (
            <div style={{display:'inline-block'}}>
                <select
                    name={name}
                    placeholder="请选择"
                    className="wowjoy-select__inner"
                    value={value}
                    onChange={this.handleChange}>
                    {options.map((option, index) => {
                        return <option key={index} value={option}>{option}</option>
                    })}
                </select>
            </div>
        );
    }
}

export default Select;