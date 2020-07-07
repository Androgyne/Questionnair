import React, {Component} from 'react';
import Input from '../../../libs/Input';
import Checkbox from '../../../libs/Checkbox';
// import Radio from 'libs/Radio';
import Dropdown from '../../../libs/Dropdown';
// import Button from './Button';
import ContentEditable from '../../../libs/ContentEditable';
import ShakeTransition from '../../../libs/Shake';
// import Dialog from 'libs/Dialog';
// import uuid from 'utils/utils';
// import './index.less';
import {
    PlusCircleOutlined,
    EllipsisOutlined,
    CloseOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import {Button, Radio, Rate, InputNumber} from 'antd';

import 'antd/dist/antd.css';


const rowOptions = [1, 2, 3, 4];
const decimalOptions = [0, 1, 2, 3];

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

export default class FormEditor extends Component {
    constructor(props) {
        super(props);
        this.temp = '';
        this.answer = [];
        // this.otherOptionInput = '';
        this.state = {
            // toggleMutiOption: false,
            editor: {
                ...this.props.editor,
            },
            hover: false,
            inputShake: false,
            optionShake: [],
            hasOption: [],
            hasTitle: true,
            // dialogVisible: false,
            // mutiOption: '',
            // otherOptionInput: '',
            otherOptionForwards: '',
        }
        this.switchEditor = this.switchEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleAnswerChange = this.handleAnswerChange.bind(this);
        // this.handleOtherOptionInputChange = this.handleOtherOptionInputChange.bind(this);
        // this.handleMutiOption = this.handleMutiOption.bind(this);
        this.createOption = this.createOption.bind(this);
        this.deleteOption = this.deleteOption.bind(this);
        // this.handleMutiTextarea = this.handleMutiTextarea.bind(this);
        // this.closeDialog = this.closeDialog.bind(this);
        // this.confirmDialog = this.confirmDialog.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.edit = this.edit.bind(this);
        // this.copy = this.copy.bind(this);
        this.remove = this.remove.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.disableEnter = this.disableEnter.bind(this);
    }

    static defaultProps = {
        acitveAnswer: false,
    }

    /* 首先有点乱。。。
     * 由于每次每个题目的操作实际上都是在操作整个题目数组，题目数组交给了题目组件的父组件来管理
     * 所以每次题目操作完以后更新父组件的题目数组，父组件更新会触发题目组件的componentWillReceiveProps生命周期函数
     */
    componentWillReceiveProps(nextProps) {
        /*
         * 每次只能编辑一个题目，所以触发再次添加题目的操作，将会引起当前题目的抖动
         * 连续点击产生连续抖动的效果，所以创建一个变量editorShake，来标志表格需要抖动
         * 由于是更新数组，为了在抖动的效果下保留之前填写的数据，所以比较之前和新的editorShake是否相同
         * 如果不同则说明只是要产生抖动，只更新editorShake变量
         */
        if (nextProps.editor.editorShake !== this.props.editor.editorShake) {
            this.setState({
                editor: {
                    ...this.state.editor,
                    editorShake: nextProps.editor.editorShake,
                },
            });
        } else {
            this.setState({
                editor: {
                    ...this.state.editor,
                    ...nextProps.editor,
                },
            });
        };
    }

    switchEditor(type){
        switch (type) {
            case 'radio':
                return '单选题';
            case 'dropdown':
                return '下拉题';
            case 'checkbox':
                return '多选题';
            case 'textarea':
                return '多行文本题';
            case 'text':
                return '单行文本题';
            case 'input':
                return '数字填空题';
            case 'score':
                return '评分题';
            default:
                return '错误';
        };
    }

    handleChange=(e, index)=>{
        let value = e.target ? e.target.value : e;
        // console.log(typeof value);
        let key = e.target.name;
        let checked = e.target.checked;
        if (key === 'title' && value) {
            //控制题目input边框颜色
            this.setState({
                hasTitle: true,
            });
        };
        if (key === 'options') {
            let {
                options,
            } = this.state.editor;
            let {
                hasOption,
            } = this.state;
            hasOption[index] = true;
            this.setState({
                hasOption: [...hasOption],
            })
            let optionsTemp = options.concat();
            optionsTemp[index] = value;
            value = optionsTemp;
        };
        if (key === 'required') {
            console.log("required");
            value = checked;
        };
        if (key === 'maxLength') {
            value = parseInt(value);
        };
        this.setState(prevState => ({
            editor: {
                ...prevState.editor,
                [key]: value,
            },
        }));
    }
    //填写答案时触发的事件
    // handleAnswerChange = (e, index) => {
    //     let {
    //         type,
    //     } = this.state.editor;
    //     let value = e.target.value;
    //     this.optionIndex = e.target.dataset.index;
    //     if (value === 'undefined') {
    //         value = this.otherOptionValue;
    //     };
    //     if (type === 'checkbox') {
    //         let valueIn = this.answer.checkbox.optionValue.includes(value);
    //         let indexIn = this.answer.checkbox.optionIndex.includes(this.optionIndex);
    //         this.answer.checkbox.optionValue[this.optionIndex] = valueIn ? null : value;
    //         this.answer.checkbox.optionIndex[this.optionIndex] = indexIn ? null : this.optionIndex;
    //         this.answer.checkbox.otherOptionValue = this.otherOptionValue;
    //     } else if (type === 'radio') {
    //         // console.log(type);
    //         this.answer = {
    //             'radio' :  {
    //                 optionValue: value,
    //                 optionIndex: this.optionIndex,
    //                 otherOptionValue: this.otherOptionValue,
    //             }
    //         };
    //     } else {
    //         this.answer = {
    //             type: value,
    //
    //         };
    //     };
    //     const answerEditor = {
    //         ...this.state.editor,
    //         answer: this.answer,
    //     };
    //     this.props.onAnswer(answerEditor, this.props.index);
    // }
    // //填写radio、checkbox'其他'选项时触发的方法
    // handleOtherOptionInputChange=(e) =>{
    //     const {
    //         type,
    //         otherOptionForwards,
    //         otherOptionBackwards,
    //     } = this.state.editor;
    //     this.otherOptionValue = e.target.innerHTML;
    //     this.allValue = otherOptionForwards + this.otherOptionValue + otherOptionBackwards;
    //     this.optionIndex = e.target.dataset.index;
    //     if (type === 'checkbox') {
    //         const length = this.answer.checkbox.optionValue.length;
    //         this.answer.checkbox.optionValue[length - 1] = this.answer.checkbox.optionValue[length - 1] === null ? null : this.allValue;
    //         this.answer.checkbox.otherOptionValue = this.allValue;
    //     } else if (type === 'radio') {
    //         this.answer = {
    //             'radio':{
    //                 optionValue: this.allValue,
    //                 optionIndex: this.optionIndex,
    //                 otherOptionValue: this.allValue,
    //             }
    //         };
    //     } else {
    //         this.answer = {
    //             type: this.allValue
    //         };
    //     };
    //     const answerEditor = {
    //         ...this.state.editor,
    //         answer: this.answer,
    //     };
    //     this.props.onAnswer(answerEditor, this.props.index);
    // }
    //新增选项
    createOption=()=>{
        this.setState(prevState => ({
            editor: {
                ...prevState.editor,
                'options': [...prevState.editor.options, ''],
            },
        }));
    }
    //删除选项
    deleteOption=(index)=>{
        let options = [...this.state.editor.options];
        options.splice(index, 1);
        this.setState(prevState => ({
            editor: {
                ...prevState.editor,
                options,
            },
        }));
    }
    /*
     * 以下都是有关于批量编辑的事件
     */
    //点击打开批量编辑的弹窗
    // handleMutiOption(){
    //     this.setState({
    //         dialogVisible: true,
    //         mutiOption: this.state.editor.options.join('\n'),
    //     });
    // }
    // //批量编辑textarea中的change
    // handleMutiTextarea(e){
    //     this.mutiTextareaValue = e.target.value;
    //     this.setState({
    //         mutiOption: e.target.value,
    //     });
    // }
    // //关闭批量编辑的弹窗
    // closeDialog(){
    //     this.setState({
    //         dialogVisible: false,
    //     });
    // }
    // //打开批量编辑的弹窗
    // confirmDialog(){
    //     const options = this.mutiTextareaValue.split('\n');
    //     this.setState(prevState => ({
    //         dialogVisible: false,
    //         editor: {
    //             ...prevState.editor,
    //             options,
    //         },
    //     }));
    // }
    //确认
    confirm (){
        const {
            index,
            handleConfirm,
        } = this.props;
        const {
            editor,
            inputShake,
        } = this.state;
        if (!editor.title && editor.type !== 'input') {
            this.setState(prevState => ({
                inputShake: !prevState.inputShake,
                hasTitle: false,
            }));
            return;
        };
        //判断选项是否为空
        if (['radio', 'checkbox', 'dropdown'].includes(editor.type)) {
            let empty = editor.options.some((item, index) => {
                if (item === '') {
                    this.setState(prevState => {
                        prevState.optionShake[index] = !prevState.optionShake[index];
                        prevState.hasOption[index] = false;
                        return {
                            optionShake: [...prevState.optionShake],
                            hasOption: [...prevState.hasOption],
                        }
                    })
                    return true;
                }
            })
            if (empty) {
                return;
            }
        };
        const newEditor = {
            ...editor,
            isEditor: false,
            isFirst: false,
        };
        if (handleConfirm) {
            handleConfirm(index, newEditor);
        };
        this.isFirst = false;
        this.temp = JSON.parse(JSON.stringify(this.state.editor));
    }
    //取消
    cancel(){
        const {
            index,
            handleCancel,
        } = this.props;
        if (handleCancel) {
            handleCancel(index);
        };
        this.setState({
            editor: this.temp,
        });
    }
    //编辑
    edit(){
        const {
            index,
            handleEdit,
        } = this.props;
        if (handleEdit) {
            handleEdit(index);
        };
    }
    //复制
    // copy(){
    //     const {
    //         index,
    //         handleCopy,
    //     } = this.props;
    //     if (handleCopy) {
    //         handleCopy(index);
    //     };
    // }

    //删除
    remove = () => {
        const {
            index,
            handleRemove,
        } = this.props;
        if (handleRemove) {
            handleRemove(index);
        };
    }
    //鼠标进入
    mouseEnter(){
        if (!this.props.drag && !this.props.acitveAnswer) {
            this.setState({
                hover: true,
            });
        };
    }
    //鼠标离开
    mouseLeave(){
        if (!this.props.drag && !this.props.acitveAnswer) {
            this.setState({
                hover: false,
            });
        };
    }
    disableEnter(event){
        if (event.which == 13) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();
        };
    }
    render() {
        const {
            index,
            curMoveItem,
            drag,
            acitveAnswer,
        } = this.props;
        const {
            // toggleMutiOption,
            editor,
            hover,
            inputShake,
            optionShake,
            hasOption,
            hasTitle,
            // dialogVisible,
            // mutiOption,
        } = this.state;
        let {
            type,
            isEditor,
            title,
            required,
            options,
            rows,
            textareaHeight,
            maxLength,
            otherOption,
            otherOptionForwards,
            otherOptionBackwards,
            completionForwards,
            completionBackwards,
            decimals,
            scoreBegin,
            scoreRange,
            editorShake,
            cascadeQuestion,
            cascadeOption,
            answer,
        } = editor;
        // this.answer = answer && JSON.parse(JSON.stringify(answer));
        // this.otherOptionValue = answer && this.answer[type].otherOptionValue;
        /*
         *
         * 以下元素为编辑状态下的元素
         *
         */
        //编辑状态下的题目
        const ediTitleEl = (
            <div style={{display: 'flex', alignItems: 'center', margin: '15px 0', position: 'relative'}}>
                <label style={{position: 'absolute', left: 0, width: 32, textAlign: 'right'}}>题目</label>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: 40, height: 36}}>
                    <ShakeTransition shake={inputShake}>
                        <Input
                            name={'title'}
                            value={title}
                            onChange={this.handleChange}
                            style={{
                                borderColor: hasTitle ? '' : 'red'
                            }}
                            width='100%'
                        />
                    </ShakeTransition>
                </div>
            </div>
        );
        //编辑状态下的选项框
        const optionsArr = options.map((option, index) => {
            return (
                <div style={{display: 'flex', alignItems: 'center', margin:'15px 0', position: 'relative'}} key={index}>
                    <label style={{position: 'absolute', left:0, textAlign: 'right', width: 32}}>
                        {/*<i className="iconfont icon-xuanxiangicon"></i>*/}
                        <EllipsisOutlined />
                    </label>
                    <div style={{flex: 1, display: 'flex', alignItems:'center', marginLeft: 40, height: 36}}>
                        <ShakeTransition shake={optionShake[index]}>
                            <Input
                                index={index}
                                name={'options'}
                                value={option}
                                onChange={this.handleChange}
                                style={{
                                    borderColor: hasOption[index] === false ? 'red' : ''
                                }}
                                width='100%'
                            />
                        </ShakeTransition>
                    </div>
                    <CloseOutlined style={{width: 10}} onClick={()=>this.deleteOption(index)}/>
                    {/*<i className="iconfont icon-chachaicon" onClick={() => this.deleteOption(index)}></i>*/}

                </div>
            )
        });
        //编辑状态下的选项框和新建框
        const ediOptionsEl = (
            <div>
                { optionsArr }
                <div style={{display: 'flex', alignItems: 'center', margin:'15px 0', position: 'relative'}}>
                    <div style={{flex: 1, display: 'flex', alignItems:'center', marginLeft: 40, height: 36}}>
                        <div style={{width: '100%', height: 36, border: '1px dashed #ddd', display: 'flex', alignItems:'center', cursor: 'pointer'}} onClick={this.createOption}>
                            {/*<i className="iconfont icon-xinjianxuanxiangicon"></i>*/}
                            <PlusCircleOutlined style={{marginRight:5, marginLeft: 7}}/>
                            <span style={{ color: '#999' }}>新建选项</span>
                        </div>
                    </div>
                    <CloseOutlined style={{width: 10, visibility: 'hidden'}} />
                    {/*<i className="iconfont icon-chachaicon" style={{ visibility: 'hidden' }}></i>*/}
                </div>
            </div>
        );
        // //编辑状态下的”其他“选项
        // const ediOtherOptionsEl = (
        //     <div className="editor-row">
        //         <div className="editor-row-content">
        //             <div className="other-option-wrapper">
        //                 {/*<ContentEditable*/}
        //                 {/*    name={'otherOptionForwards'}*/}
        //                 {/*    html={otherOptionForwards}*/}
        //                 {/*    onChange={this.handleChange}*/}
        //                 {/*    onKeyPress={this.disableEnter}*/}
        //                 {/*/>*/}
        //                 {/*<div className="other-fill">*/}
        //                 {/*    <div className="other-fill-inner">____</div>*/}
        //                 {/*</div>*/}
        //                 {/*<ContentEditable*/}
        //                 {/*    style={{ flex: 1 }}*/}
        //                 {/*    name={'otherOptionBackwards'}*/}
        //                 {/*    html={otherOptionBackwards}*/}
        //                 {/*    onChange={this.handleChange}*/}
        //                 {/*    onKeyPress={this.disableEnter}*/}
        //                 {/*/>*/}
        //             </div>
        //         </div>
        //         {/*<i className="iconfont icon-chachaicon" onClick={() => this.handleChange({target: {value: false, name: 'otherOption'}})}></i>*/}
        //     </div>
        // );
        //编辑状态下的填空题
        // const ediCompletionEl = (
        //     <div style={{display: 'flex', alignItems: 'center', margin:'15px 0', position: 'relative'}}>
        //         <label style={{position: 'absolute', left:0, textAlign: 'right', width: 32}}>内容</label>
        //         <div style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: 40, height: 36}}>
        //             <div style={{width: '100%', background: '#fff', padding: '0 11px', border: '1px solid #ddd', display: 'flex', transition: 'all .3s'}}>
        //                 <ContentEditable
        //                     style={{outline:'none', lineHeight:'36px'}}
        //                     name={'completionForwards'}
        //                     html={completionForwards}
        //                     onChange={this.handleChange}
        //                     onKeyPress={this.disableEnter}
        //                 />
        //                 <div style={{width: 30, height: 36, paddingTop: 5}}>
        //                     <div style={{height:25, paddingTop: 3, border: '1px solid transparent', cursor: 'pointer', transition: 'all .3s', $nest: {'&:hover':{color: '#45A8E6'}}}}>____</div>
        //                 </div>
        //                 <ContentEditable
        //                     style={{ outline: 'none', lineHeight: '36px',flex: 1 }}
        //                     name={'completionBackwards'}
        //                     html={completionBackwards}
        //                     onChange={this.handleChange}
        //                     onKeyPress={this.disableEnter}
        //                 />
        //             </div>
        //         </div>
        //     </div>
        // );
        //添加"其他"选项 | 批量编辑
        // const ediCtrlOptionsEl = (
        //     <div className="options-control">
        //         <button
        //             className="control-button"
        //             style={{
        //                 color: otherOption ? '#CCC' : '#45A8E6',
        //                 cursor: otherOption ? 'not-allowed' : 'pointer',
        //                 fontSize: 14
        //             }}
        //             disabled={otherOption}
        //             onClick={() => this.handleChange({target: {value: true, name: 'otherOption'}})}>
        //             添加“其他”选项
        //         </button>
        //         <span style={{ margin: '0 10px' }}>|</span>
        //         <button
        //             className="control-button"
        //             style={{
        //                 color: toggleMutiOption ? '#CCC' : '#45A8E6',
        //                 cursor: toggleMutiOption ? 'not-allowed' : 'pointer',
        //                 fontSize: 14
        //             }}
        //             disabled={toggleMutiOption}
        //             onClick={() => this.handleMutiOption()}>
        //             批量编辑
        //         </button>
        //     </div>
        // );
        /*
         *
         * 以下元素为填写状态下的元素
         *
         */
        //填写状态下的填空
        console.log(Math.pow(0.1, decimals).toFixed(decimals));
        const subCompletionEl = (
            <div style={{display: 'inline-block'}}>
                {/*<span>{completionForwards}</span>*/}
                {/*<div*/}
                {/*    style={{borderBottom: '1px solid', minWidth: 80, display: 'inline-block', padding: '0 5px',outline: 'none', cursor: 'text'}}*/}
                {/*    onInput={this.handleOtherOptionInputChange}*/}
                {/*    onKeyPress={this.disableEnter}*/}
                {/*    contentEditable*/}
                {/*    dangerouslySetInnerHTML={{ __html: answer && this.answer[type] }}>*/}
                {/*</div>*/}
                {/*<span>{completionBackwards}</span>*/}
                <InputNumber defaultValue={Math.pow(0.1, decimals).toFixed(decimals)} step={Math.pow(0.1, decimals)} onChange={this.handleAnswerChange}/>
            </div>
        );
        //填写状态下的单选、多选其他选项
        // const subOtherOptionsEl = (
        //     <div className="subject-other-option">
        //         <span>{otherOptionForwards}</span>
        //         <div
        //             className='other-option-input'
        //             onInput={this.handleOtherOptionInputChange}
        //             onKeyPress={this.disableEnter}
        //             contentEditable
        //             dangerouslySetInnerHTML={{ __html: this.otherOptionInput }}>
        //         </div>
        //         <span>{otherOptionBackwards}</span>
        //     </div>
        // );
        //填写状态下的单选、多选
        const optionsCom = otherOption ? options.concat('undefined') : options;
        const subRadioEl = (
            <div className="radio-group">
                {optionsCom.map((data, index) => {
                    return (
                        <label
                            style={{ display: 'inline-block', cursor: 'pointer', width: `${100/parseInt(rows)}%`, marginBottom: 8 }}
                            key={uuid()}>
                            <input
                                type="radio"
                                name="radio"
                                data-index={index}
                                value={data}
                                // defaultChecked={answer && this.answer.radio.optionIndex === index+''}
                                onChange={this.handleAnswerChange}
                                style={{ display: 'none' }}
                                />
                            {/*<Radio*/}
                            {/*    name="radio"*/}
                            {/*    data-index={index}*/}
                            {/*    defaultChecked={answer && this.answer.radio.optionIndex === index+''}*/}
                            {/*    onChange={this.handleAnswerChange}*/}
                            {/*    ></Radio>*/}
                            <span style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: '#fff',
                                border: '1px solid #DBDBDB',
                                verticalAlign: 'sub',
                                marginRight: 5
                            }}></span>
                            <span style={{display: 'inline-block', maxWidth: '80%', verticalAlign: 'top', wordBreak: 'break-all'}}>
                                {/*{data === 'undefined' ? (*/}
                                {/*    <div className="subject-other-option">*/}
                                {/*        <span>{otherOptionForwards}</span>*/}
                                {/*        <div*/}
                                {/*            data-index={index}*/}
                                {/*            className='other-option-input'*/}
                                {/*            onInput={this.handleOtherOptionInputChange}*/}
                                {/*            onKeyPress={this.disableEnter}*/}
                                {/*            contentEditable*/}
                                {/*            dangerouslySetInnerHTML={{ __html: this.otherOptionValue }}>*/}
                                {/*        </div>*/}
                                {/*        <span>{otherOptionBackwards}</span>*/}
                                {/*    </div>*/}
                                {/*) : data}*/}
                                {data}
                            </span>
                        </label>
                    )
                })}
            </div>
        );
        const subCheckboxEl = (
            <div className="checkbox-group">
                {optionsCom.map((data, index) => {
                    return (
                        <label
                            key={uuid()}
                            style={{ cursor: 'pointer', display: 'inline-block', width: `${100/parseInt(rows)}%`, marginBottom: 8 }}>
                            <input
                                type="checkbox"
                                name="checkbox"
                                value={data}
                                data-index={index}
                                // defaultChecked={answer && this.answer.checkbox !== '' && this.answer.checkbox.optionIndex.includes(index+'')}
                                onChange={this.handleAnswerChange}
                                style={{ display: 'none' }}
                                />
                            <span style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: 16,
                                height: 16,
                                background: '#fff',
                                border: '1px solid #DBDBDB',
                                verticalAlign: 'sub',
                                marginRight: 5
                            }}></span>
                            <span style={{
                                display: 'inline-block',
                                maxWidth: '80%',
                                verticalAlign: 'top',
                                wordBreak: 'break-all'
                            }}>
                                {data}
                            </span>
                        </label>
                    )
                })}
            </div>
        );
        //填写状态下的下拉框
        const subDropdownEl = (
            <select
                style={{width: 200, outline: 'none' }}
                // defaultValue={ answer && this.answer[type] }
                onChange={this.handleAnswerChange}>
                {options.map((option, index) => {
                    return <option key={index} value={option}>{option}</option>
                })}
            </select>
        );
        const optionsEl = type === 'dropdown' ? subDropdownEl : (type === 'radio' ? subRadioEl : subCheckboxEl);
        //填写状态下的单行文本、多行文本
        const subTextEl = (
            <input
                // defaultValue={ answer && this.answer[type] }
                style={{ outline: 'none', border:'1px solid #DDDDDD',width: '100%',resize: 'none', padding:'0 11px', height: 36 }}
                onChange={this.handleAnswerChange}
                maxLength={maxLength} />
        );
        const subTextareaEl = (
            <textarea
                // defaultValue={ answer && this.answer[type] }
                style={{ outline: 'none', border:'1px solid #DDDDDD',width: '100%',resize: 'none', padding:'0 11px',}}
                name={'textarea'}
                onChange={this.handleAnswerChange}
                rows={textareaHeight} />
        );

        let a = [];
        for(let n = 0; n < parseInt(scoreRange); n++) {
            a[n] = parseInt(scoreBegin)+n;
            // console.log(typeof n);
        }
        const subScoreEl= (
            <span style={{marginLeft: 10}}>
                <span>最低</span>
                <span style={{margin:'0 5px'}}>
                    {a.map((data, index) => {
                        return (
                            <label
                                className="wowjoy-radio"
                                // style={{ display: 'inline-block', cursor: 'pointer', width: `${100/parseInt(rows)}%`, marginBottom: 8 }}
                                style={{width: `${100/parseInt('10')}%`, marginBottom: 8}}
                                key={uuid()}>
                                <input
                                    type="radio"
                                    name="radio"
                                    data-index={index}
                                    value={data}
                                    // defaultChecked={answer && this.answer.radio.optionIndex === index+''}
                                    onChange={this.handleAnswerChange}
                                    style={{ display: 'none' }}
                                />
                                <span className="wowjoy-radio__inner"></span>
                                <span style={{display: 'inline-block', maxWidth: '80%', verticalAlign: 'top', wordBreak: 'break-all'}}>
                                    {data}
                                </span>
                            </label>
                        )
                    })}
                </span>
                <span>最高</span>
                {/*{value ? <span>{a[value - 1]}</span> : ''}*/}
            </span>
        )

        return (
            /*
             * 想了很多交互，最终认为还是将编辑模块和题目模块放在一起实现起来相对方便点，虽然这样造成的后果是代码很臃肿。。。
             * 如果不这样做，组件之间的传值问题将会变得错综复杂
             * 后期有时间再仔细想想看看能不能有更优的办法
             */
            <div style={{width: '100%'}}>
                {isEditor ? (
                    <ShakeTransition shake={editorShake}>
                        <div style={{width:'100%', backgroundColor: '#f5f5f5', position: 'relative', fontSize: 14}}>
                            <div style={{width:700, margin: '0 auto', padding: '15px 0', color: '#666', marginBottom: 20}}>
                                <div>
                                    {/*<i className="iconfont icon-Q-icon"></i>*/}
                                    <span style={{fontFamily: 'PingFangSC-Medium'}}>{this.switchEditor(type)}</span>
                                </div>
                                {ediTitleEl}
                                <div style={{display: 'flex', alignItems: 'center', margin:'15px 0', position: 'relative'}}>
                                    <div style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: 40, height: 36}}>
                                        <Checkbox
                                            name={'required'}
                                            defaultChecked={required}
                                            label={'必填'}
                                            onChange={this.handleChange}
                                            style={{
                                                marginRight: 15
                                            }}
                                        />
                                    </div>
                                </div>
                                {['radio', 'dropdown', 'checkbox'].includes(type) && ediOptionsEl}
                                {['radio', 'checkbox'].includes(type) && (
                                    <div style={{width: '100%', borderTop: '1px solid #DBDBDB', padding: '20px 0', display: 'flex'}}>
                                        <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                          每行显示
                                          <Dropdown
                                              name={'rows'}
                                              value={rows}
                                              options={rowOptions}
                                              onChange={this.handleChange}/>
                                          个选项
                                        </span>
                                    </div>
                                )}
                                {'textarea' === type && (
                                    <div style={{width: '100%', borderTop: '1px solid #DBDBDB', padding: '20px 0', display: 'flex'}}>
                                        <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                          文本框高度
                                          <Input
                                              width={60}
                                              margin={'0 10px'}
                                              type={"number"}
                                              name={'textareaHeight'}
                                              value={textareaHeight}
                                              onChange={this.handleChange} />
                                          行
                                        </span>
                                    </div>
                                )}
                                {'input' === type && (
                                    <div style={{width: '100%', borderTop: '1px solid #DBDBDB', padding: '20px 0', display: 'flex'}}>
                                        <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                          填写小数位数
                                            <Dropdown
                                                name={'decimals'}
                                                value={decimals}
                                                options={decimalOptions}
                                                onChange={this.handleChange}/>
                                        </span>
                                    </div>
                                )}
                                {'score' === type && (
                                    <div style={{width: '100%', borderTop: '1px solid #DBDBDB', padding: '20px 0', display: 'flex'}}>
                                        <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                          起始数值
                                          <Input
                                              width={60}
                                              margin={'0 10px'}
                                              type={"number"}
                                              name={'scoreBegin'}
                                              value={scoreBegin}
                                              onChange={this.handleChange} />
                                          评分范围
                                          <Input
                                              width={60}
                                              margin={'0 10px'}
                                              type={"number"}
                                              name={'scoreRange'}
                                              value={scoreRange}
                                              onChange={this.handleChange} />
                                        </span>
                                    </div>
                                )}
                                <div style={{width: '100%', borderTop: '1px solid #DBDBDB', padding: '20px 0', display: 'flex'}}>
                                    <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                        级联题目
                                        <Input
                                            width={60}
                                            margin={'0 10px'}
                                            type={"number"}
                                            name={'cascadeQuestion'}
                                            value={cascadeQuestion}
                                            onChange={this.handleChange} />
                                    </span>
                                    <span style={{display: 'flex', alignItems: 'center', marginRight: 60, fontSize: 15}}>
                                        级联选项
                                        <Input
                                            width={60}
                                            margin={'0 10px'}
                                            type={"number"}
                                            name={'cascadeOption'}
                                            value={cascadeOption}
                                            onChange={this.handleChange} />
                                        </span>
                                </div>
                                <div style={{width:'100%', textAlign:'center'}}>
                                    <Button style={{margin: 6, width: 168, height:40, borderColor:'#34a4fc', fontSize: 14}}type="primary" onClick={this.confirm}>确定</Button>
                                    <Button style={{margin: 6, width: 168, height:40, borderColor:'#34a4fc', fontSize: 14}}type="cancel" onClick={this.cancel}>取消</Button>
                                </div>
                            </div>
                            {/*<Dialog*/}
                            {/*    visible={dialogVisible}*/}
                            {/*    title="批量修改"*/}
                            {/*    onCancel={this.closeDialog}*/}
                            {/*    onConfirm={this.confirmDialog}>*/}
                            {/*    <Input*/}
                            {/*        type="textarea"*/}
                            {/*        value={mutiOption}*/}
                            {/*        onChange={this.handleMutiTextarea}*/}
                            {/*        rows={6} />*/}
                            {/*</Dialog>*/}
                        </div>
                    </ShakeTransition>
                ) : (
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            padding: '20px 0',
                            overflow: 'hidden',
                            minHeight: 144,
                            border: '1px transparent',
                            background: drag ? '' : (hover ? '#F5F5F5' : '#fff'),
                            borderTopColor: (drag && index === 0) ? '#dbdbdb' : '',
                            borderBottomColor: drag ? '#dbdbdb' : '',
                            cursor: acitveAnswer ? '' : 'move'
                        }}
                        onMouseEnter={this.mouseEnter}
                        onMouseLeave={this.mouseLeave}>
                        <div style={{ width: 700, margin: acitveAnswer ? '' : '0 auto'}}>
                            <div style={{marginBottom: 8, width:'100%'}}>
                                <span>{index + 1}.</span>
                                <span>{title}</span>
                                {required && <span style={{color: 'red', verticalAlign: 'middle', marginLeft: 5}}>*</span>}
                            </div>
                            {/*{remark && <div className="subject-row subject-remarks">{remarkText}</div>}*/}
                            <div style={{marginBottom: 8, width: '100%'}}>
                                {['radio', 'dropdown', 'checkbox'].includes(type) && optionsEl}
                                {type === 'text' && subTextEl}
                                {type === 'textarea' && subTextareaEl}
                                {type === 'input' && subCompletionEl}
                                {type === 'score' && subScoreEl}
                            </div>
                        </div>
                        {!acitveAnswer && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 2,
                                    background: curMoveItem === index ? 'rgba(245,245,245,0.3)' : ''
                                }}>
                            </div>
                        )}
                        <div
                            style={{
                                width: 48,
                                background: '#ededed',
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                transition: 'transform .2s',
                                zIndex: 3,
                                display: 'block',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 'auto 0',
                                // transform: 'translateX(100%)'
                                transform: drag ? '' : (hover ? 'translateX(0)' : 'translateX(100%)')
                            }}
                        >
                            <div style={{margin: 'auto', width: '100%', height:144, display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                <div style={{
                                    width:'100%',
                                    cursor:'pointer',
                                    flex: 1,
                                    display: 'flex',
                                    margin: 'auto 0',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    $nest: {'&:hover':{color: '#34a4fc'}}}}
                                     onClick={this.edit}>
                                    <EditOutlined style={{width: '100%',color:'#34a4fc'}}/>
                                </div>
                                <div style={{
                                    width:'100%',
                                    cursor:'pointer',
                                    flex: 1,
                                    margin: 'auto 0',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    $nest: {'&:hover':{color: '#34a4fc'}}}}
                                     onClick={this.remove}>
                                    <DeleteOutlined style={{width: '100%',color:'#34a4fc'}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
