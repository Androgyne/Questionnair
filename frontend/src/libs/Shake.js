import React, {Component} from 'react';
import './Shake.less';

class ShakeTransition extends Component {
    constructor() {
        super();
        this.state = {
            shake: false,
        }
        this.triggerShake = this.triggerShake.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shake !== this.props.shake) {
            this.setState({
                shake: true,
            });
            console.log(this.state.shake);
            this.timerID = setTimeout(() => this.triggerShake(), 1000);
        };
    }

    triggerShake=()=>{
        console.log(this.state.shake);
        this.setState({
            shake: false,
        });
    }

    componentWillUnmount() {
        clearTimeout(this.timerID);
    }

    render() {
        const {
            children,
        } = this.props;
        const {
            shake,
        } = this.state;
        return (
            <div className={`shake-transition ${shake ? 'shaked' : ''}`}>
                {this.props.children}
            </div>
        );
    }
}

export default ShakeTransition;