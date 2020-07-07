import React, {Component} from "react";
import { Carousel} from 'antd';
import 'antd/dist/antd.css';
import MyHeader from "../components/Header";

export default class Home extends Component{

    constructor(props) {
        super(props);
        let uid = this.props.location.state ? this.props.location.state.uid: '';
        this.state={
            uid: uid
        }
        console.log(this.state.uid);
    }

    render(){

        return (
            <div style={{display: 'flex', flexDirection: 'column', width:document.body.offsetWidth, height: document.body.clientHeight, background: '#ececec', justifyContent: 'center'}}>
                <MyHeader history={this.props.history} uid={this.state.uid}/>
                <div style={{margin: '200px auto'}}>
                    <span style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', color: '#34a4fc'}}>
                        Super
                    </span>
                    <span style={{fontSize: 30, fontStyle: 'italic', fontWeight: 'normal'}}>
                        问卷
                    </span>
                    <span style={{fontSize: 25, fontStyle: 'italic'}}>
                        , 问卷收集更简单
                    </span>
                </div>
                {/*<div style={{margin: '100px auto', width: '90%', height:'50%', backgroundColor: 'white'}}>*/}

                {/*<Carousel autoplay>*/}
                {/*    <div>*/}
                {/*        <h3>1</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3>2</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3>3</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3>4</h3>*/}
                {/*    </div>*/}
                {/*</Carousel>*/}
                {/*</div>*/}
            </div>
        )
    }
}