import React, {Component} from 'react';
import { Checkbox as CheckboxAnt} from "antd";
import 'antd/dist/antd.css';

export default class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    static defaultProps = {
        value: '',
        name: '',
    }

    handleChange=(e)=>{
        const {
            onChange,
            index,
        } = this.props;
        if (onChange) {
            onChange(e, index);
        };
    }

    render() {
        const {
            defaultChecked,
            value,
            name,
            index,
            label,
            style,
        } = this.props;
        return (
            // <label className="wowjoy-checkbox" style={style}>
            //     <input
            //         type="checkbox"
            //         name={name}
            //         value={value}
            //         data-index={index}
            //         defaultChecked={defaultChecked}
            //         onChange={this.handleChange}
            //         style={{ display: 'none' }}/>
            //     <span className="wowjoy-checkbox__inner"></span>
            //     <span className="wowjoy-checkbox__text">{label}</span>
            // </label>
            <CheckboxAnt
                onChange={this.handleChange}
                defaultChecked={defaultChecked}
                name={name}
                value={value}>
                    {label}
            </CheckboxAnt>
        );
    }
}