import React, {Component} from "react";
import { Button, Card, Drawer, Select, Modal} from 'antd';
import 'antd/dist/antd.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import MyHeader from "../components/Header";
import {PlusOutlined} from '@ant-design/icons';
const {Option} = Select;

export default class FormList extends Component{
    constructor(props) {
        super(props);
        let {user} = this.props.location.state;
        this.state = {
            user: user,
            forms: [],
            visible: false,
            modalVisible: false,
        }
        // console.log(this.state.user);
        this.showDrawer = this.showDrawer.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onAnalysis = this.onAnalysis.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.setOption = this.setOption.bind(this);
        this.stop = this.stop.bind(this);
        this.getNum = this.getNum.bind(this);
    }

    showDrawer =(fid, title, state, time) =>{
        this.getNum(fid);
        this.setState({
            visible: true,
            currentIndex: fid,
            title: title,
            state: state,
            time: time,
        })
    }

    async getNum(fid){
        const response = await fetch('/answer/num/' + fid);
        const body = await response.json();
        this.setState({num: body});
    }
    onClose = () => {
        this.setState({
            visible: false
        })
    }

    onAnalysis = (fid) =>{
        this.props.history.push({pathname: '/form/analysis/'+fid, state: {uid: this.state.user}});
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
            option: 0
        });
    };

    handleOk = e => {
        this.setState({
            modalVisible: false,
            state: 1
        });
        this.release(this.state.currentIndex);
    };

    async release(fid){
        console.log(this.state.option);
        console.log(typeof fid);
        const response = await fetch('/form/release',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fid: fid,
                    state: this.state.option,
                })
            });
    }

    stop(){
        this.setState({
            state: 0
        })
        this.stopRelease(this.state.currentIndex);
    }

    async stopRelease(fid){
        const response = await fetch('/form/stopRelease',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fid: fid,
                    state: 0,
                })
            });
    }


    handleCancel = e => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };


    async componentDidMount(){
        console.log(this.state.user);
        const response = await fetch('/form/' + this.state.user);
        const body = await response.json();
        this.setState({forms: body});
        console.log(this.state.forms);
    }

    setOption=(e)=>{
        let value = e;
        console.log(e);
        // let option = 0;
        // console.log(fid);
        switch (value) {
            case '非注册用户可填写n次': {
                console.log(this);
                this.setState({option: 1});
                break;
            }
            case '非注册用户每天可填写n次': console.log(this);this.setState({option: 2});break;
            case '注册用户可填写1次': console.log(this);this.setState({option: 3}); break;
        };
        console.log(this.state.option);
    }
    render() {
        const { forms } = this.state;
        // console.log(forms);
        return (
            <div style={{display: 'flex', width:document.body.clientWidth, height: window.screen.height+70, background: '#ececec'}}>
                <MyHeader uid={this.state.user} history={this.props.history}/>

                <Button style={{zIndex: 101, position: 'fixed', left: 300, top: 16, fontSize: 18, display: 'flex', flexDirection:'row'}} size='large' type='primary' onClick={()=>{this.props.history.push({pathname: "/form/new",state:{user: this.state.user}})}}>
                    <PlusOutlined style={{fontSize: 18}}/>
                    <span>创建问卷</span>
                </Button>
                <div  style={{ margin:'90px 90px', display:'flex', justifyContent: 'left', flexDirection: 'row', flexFlow: 'row wrap'}}>
                    {forms && forms.map((form,index) => {
                        let copyContent = 'http://10.180.157.130:3000/form/fill/'+this.state.currentIndex;
                        return (
                            <>
                                <Card hoverable style={{margin:50, width: 200, height: 240, borderColor: '#34a4fc', borderRadius: 5, justifyContent: 'center'}}
                                      onClick={()=>this.showDrawer(form.fid, JSON.parse(form.info).questionnairTitle, form.state, form.addDateString)}>
                                    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                        <span style={{margin: '10px auto', textAlign: 'center', color: 'black', fontSize: 20}}>{JSON.parse(form.info).questionnairTitle}</span>
                                        {!form.state ? <span style={{textAlign: 'center'}}>未发布</span> : <span style={{textAlign: 'center'}}>发布中</span>}
                                        <div style={{position: 'absolute', bottom: 20, left: 40, right: 40, marginBottom: 20, border: '1px solid #DBDBDB', height: 25, borderRadius: 25}}>
                                            <span style={{margin: '0 10px'}}>
                                                问卷ID：{form.fid}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                                <Drawer
                                    width={400}
                                    title={this.state.title}
                                    placement="right"
                                    closable={false}
                                    onClose={this.onClose}
                                    visible={this.state.visible}
                                    destroyOnClose={true}
                                    getContainer={false}
                                    style={{zIndex: 99, marginTop: 70, height: document.body.clientHeight-70, borderTop: '2px solid #34a4fc'}}
                                    maskStyle={{opacity: 0.2}}
                                    drawerStyle={{height: '100%'}}
                                    headerStyle={{marginTop: 30}}
                                    bodyStyle={{height: '60%'}}
                                >
                                    <p style={{margin:'10px auto', padding: '5px auto', borderBottom: '1px solid #DBDBDB'}}>
                                        <span style={{ margin:'10px 0', color: 'gray'}}>问卷状态</span>
                                        <span style={{float: 'right', marginRight: 5}}>{!this.state.state ? '未发布' : '发布中'}</span>
                                    </p>
                                    <p style={{margin:'10px auto', padding: '5px auto', borderBottom: '1px solid #DBDBDB'}}>
                                        <span style={{ margin:'10px 0', color: 'gray'}}>回收量</span>
                                        <span style={{float: 'right', marginRigth: 5}}>{this.state.num}</span>
                                    </p>
                                    <p style={{margin:'10px auto', padding: '5px auto', borderBottom: '1px solid #DBDBDB'}}>
                                        <span style={{ margin:'10px 0', color: 'gray'}}>创建时间</span>
                                        <span style={{float: 'right', marginRigth: 5}}>{this.state.time}</span>
                                    </p>
                                    <div style={{marginTop: 30}}>
                                        <a href={copyContent} style={{color: '#34a4fc'}}>{copyContent}</a>
                                        <CopyToClipboard text={copyContent}>
                                            <Button style={{marginLeft: 10}}>复制</Button>
                                        </CopyToClipboard>
                                    </div>
                                    <div style={{position: 'absolute', bottom: 40, display: 'flex', flexDirection: 'row', width:'100%', textAlign:'center', padding: '0 auto', justifyContent: 'center'}}>
                                        <Button size='large' style={{width: '30%', margin:'0 15px', border: '2px solid #34a4fc', borderRadius: 5}} onClick={()=>this.onAnalysis(this.state.currentIndex)}>数据统计</Button>
                                        {!this.state.state ?
                                            <Button size='large' style={{width: '30%', margin:'0 15px', border: '2px solid #34a4fc', borderRadius: 5}} onClick={()=>{this.showModal();}}>发布问卷</Button>
                                            :   <Button size='large' style={{width: '30%', margin:'0 15px', border: '2px solid #34a4fc', borderRadius: 5}} onClick={()=>{this.stop()}}>停止发布</Button>
                                        }
                                    </div>
                                    <Modal
                                        title="填写方式"
                                        visible={this.state.modalVisible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        okText={'发布问卷'}
                                        cancelText={'取消'}
                                        maskStyle={{opacity: 0.2}}
                                    >
                                        请选择填写方式
                                        <Select style={{ marginLeft: 20, width: 240 }} onChange={(e)=> {this.setOption(e)}}>
                                            <Option value="非注册用户可填写n次">非注册用户可填写n次</Option>
                                            <Option value="非注册用户每天可填写n次">非注册用户每天可填写n次</Option>
                                            <Option value="注册用户可填写1次">注册用户可填写1次</Option>
                                        </Select>
                                    </Modal>

                                    {/*</>*/}
                                </Drawer>
                            </>
                        );

                    })}
                </div>

            </div>
        );
    }
}