import React, {Component} from 'react';
import '../../../format.less';

import {Button, InputNumber, Radio, Rate} from 'antd';

import 'antd/dist/antd.css';


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

export default class FormDisplayer extends Component {
    constructor(props) {
        super(props);
        this.temp = '';
        this.state = {
            // toggleMutiOption: false,
            editor: {
                ...this.props.editor,
            },

            answer: {},
        }
        console.log(this.state);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        // this.handleOtherOptionInputChange = this.handleOtherOptionInputChange.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.disableEnter = this.disableEnter.bind(this);
    }

    static defaultProps = {
        acitveAnswer: true,
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
        if (nextProps.editor !== this.props.editor) {
            this.setState({
                editor: {
                    ...this.state.editor,
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

    //填写答案时触发的事件
    handleAnswerChange = (e, index) => {
        let {
            type,
            answer
        } = this.state.editor;
        // let value = e.target.value;
        let value = e.target ? e.target.value : e;
        console.log(value);
        this.optionIndex = e.target ? e.target.dataset.index : '';
        // if (value === 'undefined') {
        //     console.log('?');
        //     value = this.otherOptionValue;
        // };
        if (type === 'checkbox') {
            // let valueIn = this.state.answer.checkbox.optionValue.includes(value);
            // let indexIn = this.state.answer.checkbox.optionIndex.includes(this.optionIndex);
            // this.state.answer.checkbox.optionValue[this.optionIndex] = valueIn ? null : value;
            // this.state.answer.checkbox.optionIndex[this.optionIndex] = indexIn ? null : this.optionIndex;
            // this.state.answer.checkbox.otherOptionValue = this.otherOptionValue;
            console.log(typeof this.state.answer[type]);
            if (typeof this.state.answer[type] !== 'undefined'){
                if (!this.state.answer.checkbox.optionIndex.includes(this.optionIndex)){
                    this.state.answer[type].optionValue.push(value);
                    this.state.answer[type].optionIndex.push(this.optionIndex);
                }
            }else {
                this.state.answer[type] = {
                    optionValue: [value],
                    optionIndex: [this.optionIndex],
                    // otherOptionValue: this.otherOptionValue
                };
            }
            console.log(this.state.answer);


        } else if (type === 'radio') {
            // console.log(type);
            console.log(this.state.answer[type]);
            this.state.answer[type]={
                optionValue: value,
                optionIndex: this.optionIndex,
                // otherOptionValue: this.otherOptionValue,
            };
        } else {
            console.log(type);
            this.state.answer[type] = value;
        };
        const answerEditor = {
            ...this.state.editor,
            answer: this.state.answer,
        };
        console.log(answerEditor);
        this.props.onAnswer(answerEditor, this.props.index);
    }
    // //填写radio、checkbox'其他'选项时触发的方法
    // handleOtherOptionInputChange=(e) =>{
    //     const {
    //         type,
    //         completionForwards,
    //         completionBackwards,
    //     } = this.state.editor;
    //     this.otherOptionValue = e.target.innerHTML;
    //     this.allValue = completionForwards + this.otherOptionValue + completionBackwards;
    //     this.optionIndex = e.target.dataset.index;
    //     // if (type === 'checkbox') {
    //     //     const length = this.state.answer.checkbox.optionValue.length;
    //     //     this.state.answer.checkbox.optionValue[length - 1] = this.state.answer.checkbox.optionValue[length - 1] === null ? null : this.allValue;
    //     //     this.state.answer.checkbox.otherOptionValue = this.allValue;
    //     // } else if (type === 'radio') {
    //     //     this.state.answer[type] = {
    //     //             optionValue: this.allValue,
    //     //             optionIndex: this.optionIndex,
    //     //             otherOptionValue: this.allValue,
    //     //     };
    //     // } else {
    //         this.state.answer[type]=this.allValue
    //     // };
    //     let arr = Object.keys(this.state.answer);
    //     console.log(arr);
    //     const answerEditor = {
    //         ...this.state.editor,
    //         answer: this.state.answer,
    //     };
    //     this.props.onAnswer(answerEditor, this.props.index);
    // }
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
            title,
            required,
            options,
            rows,
            textareaHeight,
            maxLength,
            otherOption,
            scoreBegin,
            scoreRange,
            editorShake,
            decimals,
            answer,
        } = editor;
        console.log(answer);
        this.answer = answer && JSON.parse(JSON.stringify(answer));
        this.otherOptionValue = answer && this.answer[type].otherOptionValue;

        /*
         *
         * 以下元素为填写状态下的元素
         *
         */
        //填写状态下的填空
        const subCompletionEl = (
            <div style={{display: 'inline-block'}}>
                <InputNumber defaultValue={parseFloat(Math.pow(0.1, decimals).toFixed(decimals))} step={parseFloat(Math.pow(0.1, decimals).toFixed(decimals))} onChange={this.handleAnswerChange}/>
            </div>
        );
        //填写状态下的单选、多选
        const optionsCom = otherOption ? options.concat('undefined') : options;
        const subRadioEl = (
            <div className="radio-group">
                {optionsCom.map((data, index) => {
                    return (
                        <label
                            className="wowjoy-radio"
                            // style={{ display: 'inline-block', cursor: 'pointer', width: `${100/parseInt(rows)}%`, marginBottom: 8 }}
                            style={{width: `${100/parseInt(rows)}%`, marginBottom: 8}}
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
                            <span className="wowjoy-checkbox__inner"></span>
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
                defaultValue={ answer && this.answer[type] }
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
                defaultValue={ answer && this.answer[type] }
                style={{ outline: 'none', border:'1px solid #DDDDDD',width: '100%',resize: 'none', padding:'0 11px', height: 36 }}
                onChange={this.handleAnswerChange}
                maxLength={maxLength} />
        );
        const subTextareaEl = (
            <textarea
                defaultValue={ answer && this.answer[type] }
                style={{ outline: 'none', border:'1px solid #DDDDDD',width: '100%',resize: 'none', padding:'0 11px',}}
                name={'textarea'}
                onChange={this.handleAnswerChange}
                rows={textareaHeight} />
        );

        //填写下的评分题
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
            <div>
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
                     <div style={{ width: 700, margin: acitveAnswer ? '0 auto' : '0 auto'}}>
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

                 </div>
            </div>
        );
    }
}
