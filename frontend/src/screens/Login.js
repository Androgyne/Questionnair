import React, {Component} from "react";
import { Form, Input, Button, Checkbox, Card, message} from 'antd';
import 'antd/dist/antd.css';
import MyHeader from "../components/Header";


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 10,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export default class Login extends Component{

    constructor() {
        super();
        this.state = {
            id: '',
            password: '',
            users: []
        };
        this.onSignIn = this.onSignIn.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    async componentDidMount(){
        const response = await fetch('/user/list');
        const body = await response.json();
        this.setState({users: body});
    }

    welcome = (username) => {
        message.success('欢迎你, ' + username + '!');
    }
    onSignIn(){
        var authorized = false;
        const { users } = this.state;

        users.map((user) => {
            if (this.state.id === String(user.uid) && this.state.password === user.password){
                authorized = true;
            }
        });


        if(authorized) {
            this.welcome(this.state.id);
            this.props.history.replace({pathname: '/form/list', state: {user: this.state.id}});
        }else {
            message.error('用户名或密码不正确!');
        }

    }

    onChangeID(e) {
        this.setState({id: e.target.value});
    }
    onChangePassword(e){
        this.setState({password: e.target.value});
    }
    render(){
        // const onFinish = values => {
        //     console.log('Success:', values);
        // };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return (
            <div style={{display: 'flex', width:document.body.clientWidth, height: document.body.clientHeight, background: '#ececec', justifyContent: 'center'}}>
                <MyHeader history={this.props.history}/>
                <Card style={{marginTop: 150, paddingTop: 20, width: 500, height: 350, borderRadius:15}}>
                    <h3 style={{textAlign: 'center', paddingBottom: 10}}>登录</h3>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onSignIn}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                            onChange={this.onChangeID}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                            onChange={this.onChangePassword}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button size='large' style={{width: 150, borderRadius: 5}} type="primary" htmlType="submit">
                                登录
                            </Button>
                            <Button style={{border:'1px solid transparent'}} onClick={() => {this.props.history.replace('/register');}}>
                                注册新账号
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}