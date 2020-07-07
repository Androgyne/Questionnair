import React from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import 'antd/dist/antd.css';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default class MyHeader extends React.Component{
    constructor(props) {
        super(props);
        let uid = props.uid ? props.uid : '';
        this.state={
            uid: uid
        }
        console.log(this.state.uid);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.returnHome = this.returnHome.bind(this);

    }
    login(){
        this.props.history.push({pathname: '/login'});
    }
    register(){
        this.props.history.push({pathname: '/register'});
    }
    returnHome(){
        this.props.history.push({pathname: '/', state: {uid: this.state.uid}});
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0" onClick={()=> this.props.history.replace({pathname: '/form/list', state: {user: this.state.uid}})}>我的主页</Menu.Item>
                <Menu.Item key="1" onClick={()=> this.props.history.replace('/')}>退出登录</Menu.Item>
            </Menu>
        )
        return (
            // <Layout>
                <Header style={{zIndex: 100, top: 0, position: 'fixed', width: '100%',height: 70, backgroundColor: 'white', borderBottom: '2px solid #34a4fc'}}>
                    <div onClick={this.returnHome} style={{cursor: 'pointer', width: 180}}>
                        <span style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', color: '#34a4fc'}}>
                            Super
                        </span>
                        <span style={{fontSize: 30, fontStyle: 'italic', fontWeight: 'normal'}}>
                            问卷
                        </span>
                    </div>
                    {!this.state.uid &&
                        <>
                        <Button size='large' type='primary' style={{position: 'absolute', top: 15, right: 150}} onClick={this.login}>登录</Button>
                        <Button size='large' style={{position: 'absolute', top: 15, right: 60}} onClick={this.register}>注册</Button>
                        </>
                    }
                    {this.state.uid &&
                            <Dropdown overlay={menu}>
                                <a className="ant-dropdown-link" style={{display: 'flex', flexDirection: 'row', position: 'absolute', top: 10, right: 80, fontSize: 20}}>
                                    <UserOutlined style={{margin: '20px 5px', fontSize: 25, color: '#34a4fc'}}/>
                                    <span style={{fontSize: 20}}>{this.state.uid}</span>
                                    <DownOutlined style={{margin: '27px 5px',fontSize: 15}}/>
                                </a>
                            </Dropdown>
                    }
                </Header>
            // {/*</Layout>*/}
        )
    }
}