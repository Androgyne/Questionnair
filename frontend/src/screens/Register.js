import React, {Component} from "react";
import {Form, Input, Button, Checkbox, Card, message, Layout } from 'antd';
import 'antd/dist/antd.css';
import MyHeader from '../components/Header';

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


export default class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            password: '',
            email: '',
            users: [],
            double: 0
        };
        this.onSignIn = this.onSignIn.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.error = this.error.bind(this);
    }

    async componentDidMount(){
        const response = await fetch('/user/list');
        console.log(response);
        const body = await response.json();
        console.log(body);
        this.setState({users: body});
    }

    async onCreate(){
        const response = await fetch('/user/new',
            {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uid: this.state.id,
                        password: this.state.password,
                        email: this.state.email
                    })
                });
        const content = await response.json();
        console.log(content);
        return content;
    }
    onSignIn(){
        let authorized_user = true;
        let authorized_email = true;
        const { users } = this.state;

        users.map((user) => {
            if (this.state.id === String(user.uid)){
                authorized_user = false;
            };
            if (this.state.email === String (user.email)){
                authorized_email = false;
            }
        });

        if(authorized_user && authorized_email) {
            this.onCreate();
            message.success('注册成功！');
            this.props.history.push('/login');
        }else if (!authorized_user){
            this.error('用户名已经存在！');
        }else if (authorized_user && ! authorized_email){
            this.error('电子邮箱已经被注册！');
        };

    }

    error = (hint) => {
        message.error(hint);
    }

    onChangeID(e) {
        this.setState({id: e.target.value});
    }

    onChangeEmail(e) {
        this.setState({email: e.target.value});
    }

    onChangePassword(e){
        this.setState({password: e.target.value});
    }

    render(){
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        return (
            <div style={{display: 'flex', width: document.body.clientWidth, height: document.body.offsetHeight, background: '#ececec', justifyContent: 'center'}}>
                <MyHeader history={this.props.history}/>
                <Card style={{marginTop: 150, paddingTop: 20, paddingBottom: 30, width: 500, height: 500, borderRadius:15, justifyContent: 'center'}}>
                    <h3 style={{textAlign: 'center', paddingBottom: 10}}>注册</h3>
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
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                                {
                                    min: 7,
                                    message: '用户名不能少于7个字符!'
                                },
                                {
                                    pattern: /^[^\s]*$/,
                                    message: '不能输入空格!'
                                },
                            ]}
                            onChange={this.onChangeID}>
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
                                {
                                    min: 7,
                                    message: '密码不能少于7个字符!'
                                },
                                {
                                    pattern: /^[^\s]*$/,
                                    message: '不能输入空格!'
                                }
                            ]}
                            onChange={this.onChangePassword}
                            hasFeedback>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="password2"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请确认密码!',
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('您输入的两个密码不匹配!');
                                    }
                                })
                            ]}>
                            <Input.Password />
                        </Form.Item>


                        <Form.Item
                            name="email"
                            label="电子邮箱"
                            rules={[
                                {
                                    type: 'email',
                                    message: '电子邮箱地址格式不正确!',
                                },
                                {
                                    required: true,
                                    message: '请输入电子邮箱地址!',
                                },
                            ]}
                            onChange={this.onChangeEmail}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                { validator:(_, value) => value ? Promise.resolve() : Promise.reject('请阅读并同意承诺书') },
                            ]}
                            {...tailLayout}>
                            <Checkbox>
                                我已阅读并同意承诺书
                            </Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button size='large' style={{width: 150, borderRadius: 5}} type="primary" htmlType="submit">
                                注册
                            </Button>
                            <Button style={{border:'1px solid transparent'}} onClick={() => {this.props.history.replace('/login');}}>
                                已有账号？去登录
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </div>
        )
    }
}