import React from 'react';
import {Button, Card, Drawer, Form, Input, Layout, message, Modal, Select} from "antd";
import FormDisplayer from "./components/FormDisplayer";

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
export default class FillForm extends React.Component{
    constructor(props) {
        super(props);
        // let fid = this.props.params.fid;
        // this.state = {
        //     fid: fid
        // }
        console.log(this.props.match);
        this.state = {
            fid: this.props.match.params.fid,
            title: '',
            comment: '',
            editors:[],
            answers:[],
            state: 0,
            visible: false,
            id: '',
            password: '',
            users: []
        }
        // console.log(this.state.fid);
        this.submit = this.submit.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.submitCheck = this.submitCheck.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    async componentDidMount(){
        const response = await fetch('/form/fill/'+ this.state.fid);
        // console.log(response);
        const body = await response.json();
        console.log(body);
        this.setState({
            title: JSON.parse(body.info).questionnairTitle,
            comment: JSON.parse(body.info).comment,
            editors:JSON.parse(body.info).editors,
            state: body.state,
        });
        const res = await fetch('/user/list');
        const bo = await res.json();
        this.setState({users: bo});
        // this.setState({form: JSON.parse(JSON.stringify(body))});
    }

    handleAnswer(answerEditor, index){
        let new_answers = this.state.editors;
        console.log(new_answers);
        new_answers[index] = answerEditor;
        this.setState(prevState => ({
            answers: new_answers,
        }));
    }

    async onCreate(){
        console.log(JSON.stringify(this.state.answers));
        // let {user} = this.props.location.state;
        const ip = await fetch('https://ipapi.co/json/');
        const ip_json = await ip.json();
        let id = '';
        if (this.state.id){
            id = this.state.id ;
        }else {
            id = null;
        }
        console.log(ip_json);
        const response = await fetch('/answer/new',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: JSON.stringify(this.state.answers),
                    fid: this.state.fid,
                    ip: JSON.stringify(ip_json),
                    uid: id,
                })
            });
        const content = await response.json();
        console.log(content);
        return content;
    }
    submitCheck = () => {
        let {editors} = this.state;
        console.log(editors);
        let notCompleted = editors.some((editor, index) => {
            // console.log(editor);
            // console.log(editor.required);
            // console.log(typeof editor.answer === 'undefined');
            return editor.required === true && typeof editor.answer === 'undefined';
        })
        return notCompleted;

    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    onChangeID(e) {
        this.setState({id: e.target.value});
    }
    onChangePassword(e){
        this.setState({password: e.target.value});
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    submit=()=>{
        // this.state.editors
        let notCompleted = this.submitCheck();
        console.log(notCompleted);
        if (notCompleted === true){
            message.error('请填写必填题目！');
        }else{
            this.showModal();
        }

    }

    onSignIn(){
        var authorized = false;
        const { users } = this.state;

        users.map((user) => {
            if (this.state.id === String(user.uid) && this.state.password === user.password){
                authorized = true;
            }
        });

        return authorized;
    }

    handleOk = e => {

        if (this.state.state !== 3){
            this.setState({
                visible: false,
            });
            this.onCreate();
            message.success('提交成功！');
        }else {
            let authorized = this.onSignIn();
            if(authorized) {
                this.setState({
                    visible: false,
                });
                this.onCreate();
                message.success('提交成功！');
            }else {
                message.error('用户名或密码不正确!');
            }
        }
    };

    render(){
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        // console.log(this.state);
        // let {form} = this.state;
        const {title, comment, editors, state} = this.state;
        console.log(state);
        const displayEl = editors.map((editor,index) => {
            console.log(editor);
            return (
                <div
                    className="drag-wrapper"
                    // ref={el => this.editorsEl[index] = el}
                    key={editor.questionId}
                >
                    <FormDisplayer
                        index={index}
                        // curMoveItem={this.state.curMoveItem}
                        editor={editor}
                        onAnswer={this.handleAnswer}
                        // drag={drag}
                        // handleConfirm={this.confirmEdit}
                        // handleCancel={this.cancelEdit}
                        // handleEdit={this.againEdit}
                        // handleRemove={this.removeEdit}
                        // // handleCopy={this.copyEdit}
                    />
                </div>

            );
        });
        return(

            <div style={{display: 'flex', width: document.body.clientWidth, height: document.body.clientHeight, background: 'white'}}>
                {/*<div style={{display: 'flex', marginTop: 20, marginBottom: 20, width:'100%',height: document.body.clientHeight-20, background: '#fff' }}>*/}
                    <Layout style = {{display: 'flex', flexDirection: 'row', position:'relative', marginTop: 0, marginBottom:0, height:'100%', width:'100%', background: 'white', justifyContent: 'center' }}>
                        {/*<FormSideBar*/}
                        {/*    onSelectEditor={this.createEditor}/>*/}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            position: 'absolute',
                            // right: 80,
                            // left: 500,
                            backgroundColor: 'white',
                            margin: '0 auto',
                            // marginTop: 25,
                            // marginLeft:15,
                            // height: 500,
                            // minHeight: 900,
                            minHeight: '100%',
                            overflow: 'auto',
                            // width: 900
                            width: '90%'
                        }}
                             ref={el => this.page = el}>
                            {!state ? <div style={{margin: '10px 0', width: '100%', padding: '10px 0',border: '1px solid red', display: 'flex', justifyContent: 'center'}}>
                                <span style={{textAlign: 'center', color: 'red'}}>*********当前问卷未发布，填写无效！*********</span>
                            </div> : ''}
                            <div style={{
                                margin: '10px 0',
                                width: '100%',
                                padding: '10px 0',
                                borderTop: '1px solid transparent',
                                borderBottom: '1px solid transparent'}}>
                                <div style={{width: '100%', height: 45, margin:'0 auto', display: 'flex', justifyContent: 'center', border:'1px solid transparent', alignItems:'center'}}>
                                    <div
                                        style={{
                                            height: 45,
                                            borderColor: 'transparent',
                                            textAlign: 'center',
                                            fontSize: 20,
                                            color: 'black',
                                            fontFamily: 'PingFangSC-Medium'
                                        }}
                                        width='90%'>
                                        {title}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                margin: '5px 0',
                                width: '100%',
                                padding: '5px 0',
                                borderTop: '1px solid transparent',
                                borderBottom: '1px solid transparent'}}>
                                <div style={{ width: '100%', height: 45, margin:'0, auto', display: 'flex', justifyContent: 'center', border:'1px solid transparent', alignItems:'center'}}>
                                    <div
                                        style={{
                                            height: 40,
                                            borderColor: 'transparent',
                                            textAlign: 'center',
                                            fontSize: 15,
                                            color: 'black',
                                            fontFamily: 'PingFangSC-Medium'
                                        }}
                                        width='90%'>
                                        {comment}
                                    </div>
                                </div>
                            </div>
                            <div ref={el => this.content = el} >
                                {/*如果组件没有子节点，this.props.children返回false*/}
                                {displayEl}
                            </div>
                            <div style={{margin: '0 auto', display: 'flex', justifyContent: 'center', width: '40%', padding: '0 auto'}}>
                                <Button disabled={!state} onClick={this.submit} size='large' style={{margin: '20px auto', width: '100%'}} type='primary'>
                                    提交
                                </Button>
                            </div>
                            <Modal
                                title="确认提交"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                okText={'确认'}
                                cancelText={'取消'}
                                maskStyle={{opacity: 0.2}}
                            >
                                {state === 3 ?
                                    (
                                        <div>
                                            <h6 style={{margin: '20px 0', textAlign: 'center'}}>当前问卷必须登录后才可提交</h6>
                                            <Form
                                                {...layout}
                                                name="basic"
                                                // onFinish={this.onSignIn}
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
                                            </Form>

                                        </div>
                                    ) :(
                                        <div>是否确认提交？</div>
                                    )
                                }
                            </Modal>
                        </div>
                    </Layout>
            </div>
            )

    }
}