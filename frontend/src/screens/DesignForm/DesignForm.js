import React, {Component} from 'react';
import FormSideBar from './components/FormSideBar';
import FormContent from "./components/FormContent";
import FormEditor from "./components/FormEditor";
import DragSort from "../../libs/DragSort";
import { Button, Layout} from 'antd';
import 'antd/dist/antd.css';
import MyHeader from "../../components/Header";
import {SaveOutlined} from "@ant-design/icons";

function uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    const id = s.join('');
    return id;
}


export default class DesignForm extends Component{
    constructor(props) {
        super(props);
        this.editorsEl = [];
        this.state = {
            uid: this.props.location.state.user,
            editors: [],
            questionnairTitle: '问卷标题',
            comment: '来填写问卷吧!',
            cruMoveItem: null,
            drag: false
        }
        this.createEditor = this.createEditor.bind(this);
        this.updateEditors = this.updateEditors.bind(this);
        this.isThereEditor = this.isThereEditor.bind(this);
        // this.dragEditorByOutline = this.dragEditorByOutline.bind(this);
        // this.locateEditor = this.locateEditor.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.confirmEdit = this.confirmEdit.bind(this);
        this.againEdit = this.againEdit.bind(this);
        // this.copyEdit = this.confirmEdit.bind(this);
        this.removeEdit = this.removeEdit.bind(this);
        this.handleDragMove = this.handleDragMove.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.submit = this.submit.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.blurTitle = this.blurTitle.bind(this);
    }

    updateEditors =(callback)=>{
        this.state.editors.some((data, index) => {
            if (data.isFirst && data.isEditor) {
                this.state.editors.splice(index, 1)
                return true;
            } else if (!data.isFirst && data.isEditor) {
                data.isEditor = false;
                return true;
            };
        });
        callback(this.state.editors);
    }
    /*
     * 判断是否有处于编辑状态的题目, activeEditorIndex // -1,没有处于编辑状态的题目
     * 如果有处于编辑状态的题目，则激活该编辑器抖动
     */
    isThereEditor=()=>{
        const activeEditorIndex = this.state.editors.findIndex(data => data.isEditor === true);
        if (activeEditorIndex !== -1) {
            console.log(activeEditorIndex);
            let editors = JSON.parse(JSON.stringify(this.state.editors));
            editors[activeEditorIndex].editorShake = uuid();
            // console.log(activeEditorIndex + "shake");
            this.setState({
                editors,
            });
            return true;
        } else {
            return false;
        };
    }

    cancelEdit=(index)=>{
        let editors = JSON.parse(JSON.stringify(this.state.editors));
        editors[index].isFirst ? editors.splice(index, 1) : editors[index].isEditor = false;
        this.setState({
            editors,
        });
    }

    confirmEdit=(index, newEditor)=>{
        const {
            onConfirm,
        } = this.props;
        let editors = JSON.parse(JSON.stringify(this.state.editors));
        editors.splice(index, 1, newEditor);
        this.setState({
            editors,
        }, () => {
            if (onConfirm) {
                this.updateEditors(onConfirm);
            };
        });
    }

    againEdit=(index)=>{
        if (this.isThereEditor()) {
            return;
        }
        let editors = JSON.parse(JSON.stringify(this.state.editors));
        editors[index].isEditor = true;
        this.setState({
            editors,
        });
    }

    removeEdit=(index)=>{
        const {
            onRemove,
        } = this.props;
        let editors = JSON.parse(JSON.stringify(this.state.editors));
        editors.splice(index, 1);
        this.setState({
            editors,
        }, () => {
            if (onRemove) {
                this.updateEditors(onRemove);
            };
        });
    }

    handleDragMove=(editors, from, to)=>{
        this.setState({
            curMoveItem: to,
            editors,
            drag: true,
        });
    }

    handleDragEnd=()=>{
        const {
            onDrag,
        } = this.props;
        this.setState({
            curMoveItem: null,
            drag: false,
        }, () => {
            if (onDrag) {
                this.updateEditors(onDrag);
            };
        });
    }

    //问卷标题失焦事件
    blurTitle=(title)=>{
        const {
            onSaveTitle,
        } = this.props;
        if (onSaveTitle) {
            onSaveTitle(title);
        };
    }

    createEditor=(type)=>{
        if (this.isThereEditor()) {
            return;
        }

        const editor = {
            questionId: uuid(), //id
            type: type, //类型
            title: '', //题目
            required: false, //是否必填
            options: ['选项', '选项'], //选项(只有radio,checkbox,select有,其余尽量给个空数组)
            rows: 1, //选项占的行数
            textareaHeight: 3, //多行文本高度
            maxLength: 50, //单行文本限制的字数
            completionForwards: '题目：', //填空题文本(前)
            completionBackwards: '', //填空题文本(后)
            decimals: 0,//小数位数
            scoreBegin: 1,//评分起始数值
            scoreRange: 5, //评分范围
            cascadeQuestion: 1, //级联题目
            cascadeOption: 1, //级联选项
            isEditor: true, //编辑状态还是已编辑状态
            isFirst: true, //是否是新创建的
            editorShake: '',
        };
        this.setState(prevState => ({
            editors: [...prevState.editors, editor],
        }));
    }

    async onCreate(){
        console.log(JSON.stringify(this.state));
        let {user} = this.props.location.state;
        console.log(user);
        const response = await fetch('/form/new',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    info: JSON.stringify(this.state),
                    uid: user,
                    state: 0,
                    beginDate: null,
                    endDate: null
                })
            });
        const content = await response.json();
        console.log(content);
        return content;
    }


    submit=()=>{
        // this.state.editors
        console.log(this);
        const response = this.onCreate();
        console.log(response);
        this.props.history.goBack();
    }

    onChangeTitle(title){
        this.setState({
            questionnairTitle: title
        })
        console.log(this.state.questionnairTitle);
    }

    onChangeComment(comment){
        this.setState({
            comment: comment
        })
    }

    render(){

        const {
            editors,
            drag,
            editorShake,
            // scrollTo,
            questionnairTitle,
            comment
        } = this.state;
        const hasEditor = editors.some(data => data.isEditor === true);
        const canDrag = !hasEditor;
        const isFirst = editors.length !== 0 && editors[editors.length - 1].isFirst;
        const editorsEl = editors.map((editor,index) => {
            return (
                <div
                    className="drag-wrapper"
                    ref={el => this.editorsEl[index] = el}
                    key={editor.questionId}
                >
                    <FormEditor
                        index={index}
                        curMoveItem={this.state.curMoveItem}
                        editor={editor}
                        drag={drag}
                        handleConfirm={this.confirmEdit}
                        handleCancel={this.cancelEdit}
                        handleEdit={this.againEdit}
                        handleRemove={this.removeEdit}
                        // handleCopy={this.copyEdit}
                    />
                </div>

            );
        });


        return (
                <div style={{display: 'flex', width: document.body.offsetWidth, height: document.body.clientHeight, background: '#ececec'}}>
                    <MyHeader uid={this.state.uid} history={this.props.history}/>

                    <Button style={{zIndex: 101, position: 'fixed', left: 300, top: 16, fontSize: 18, display: 'flex', flexDirection:'row'}} size='large' type='primary' onClick={this.submit}>
                        <SaveOutlined style={{fontSize: 18}}/>
                        <span>保存问卷</span>
                    </Button>
                    <div style={{display: 'flex', marginTop: 70, width:'100%',height: document.body.clientHeight-70, background: '#ececec' }}>
                        <Layout style = {{display: 'flex', position:'relative', marginTop: 0, marginBottom:0, height:'100%', width:'100%', background: '#ececec' }}>
                            <FormSideBar
                                onSelectEditor={this.createEditor}/>
                            <FormContent
                                isFirst={isFirst}
                                // scrollTo={scrollTo}
                                questionnairTitle={questionnairTitle}
                                comment={comment}
                                onBlurTitle={this.blurTitle}
                                onChangeTitle={this.onChangeTitle}
                                onChangeComment={this.onChangeComment}
                            >
                                    {editorsEl.length !== 0 && (
                                        <DragSort
                                            draggable={canDrag}
                                            data={editors}
                                            onDragEnd={this.handleDragEnd}
                                            onDragMove={this.handleDragMove}>
                                            {editorsEl}
                                        </DragSort>
                                    )}
                            </FormContent>
                        </Layout>
                    </div>
                </div>
        )
    }
}
