import React from 'react';
import { Button, Table, Card} from 'antd';
import 'antd/dist/antd.css';
import Link from "react-router-dom/Link";
import {PieChartOutlined, ContainerOutlined, InfoCircleOutlined} from '@ant-design/icons';
import PieChart from "../libs/PieChart";
import MyHeader from "../components/Header";



export default class AnalysisForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            uid: this.props.location.state.uid,
            answers:[],
            form: [],
            editors: [],
            title: '',
            begin_date:'',
            end_date: '',
            currentIndex: 1,
            fid: this.props.match.params.fid,
            columns: [
                {
                    title: '查看',
                    dataIndex: 'aid',
                    render: (text)=>{
                        // console.log(text);
                        return (
                            <Button><Link to={{pathname: "/form/result/"+ parseInt(text)}}>查看</Link></Button>
                        )
                    }
                },
                {
                    title: '编号',
                    render:(text,record,index)=> {
                        return (
                            <span>{(this.state.currentIndex-1)*10+(index+1)}</span>
                        )
                    }
                },
                {
                    title: '填写用户',
                    dataIndex: 'uid',
                    key: 'uid',
                    render: (text,record,index) => {
                        if (text === null){
                            return <a>非登录用户</a>
                        }else {
                            return <a>{text}</a>
                        }
                    }
                },
                {
                    title: '填写时间',
                    dataIndex: 'dateString',
                    key: 'dateString',
                },
                {
                    title: '填写位置',
                    dataIndex: 'ip',
                    key: 'ip',
                    render: (text)=>{
                        if(text === null){
                            return <a>未记录</a>
                        }
                        let value = JSON.parse(text).city + ', ' + JSON.parse(text).region;
                        return <a>{value}</a>
                    }
                },
            ],
            text_columns: [
                {
                    title: '答案列表',
                    dataIndex: 'answer'
                }
            ]
        };

    }

    async componentDidMount(){
        const response = await fetch('/answer/'+ this.state.fid);
        const body = await response.json();
        this.setState({answers: body});

        const res = await fetch('/form/fill/' + this.state.fid);
        const bo = await res.json();
        console.log(bo);
        this.setState({
            form: JSON.parse(bo.info),
            title: JSON.parse(bo.info).questionnairTitle,
            editors: JSON.parse(bo.info).editors,
            begin_date: bo.beginDateString,
            end_date: bo.endDateString
        });
        console.log(this.state.answers);
        // console.log(typeof this.state.answers[0].date);
    }

    pagination = {
        onChange:(page, pageSize)=>{
            this.setState({
                currentIndex:page
            })
        }
    }

    render() {
        const questionBlock = this.state.editors.map((editor,index) => {
            console.log(this.state.answers);
            console.log(editor);
            let question_index = index;
            let data = [];
            if (['radio', 'dropdown', 'checkbox'].includes(editor.type)){
                let {options} = editor;
                options.map((option, index) => {
                    data.push({
                        name: option,
                        value: 0,
                        index: index
                    })
                });
                console.log(data);
                this.state.answers.map((answer, index) =>{
                    let question_answer = JSON.parse(answer.content)[question_index];
                    console.log(question_answer);
                    if( question_answer.answer ){
                        let choice = question_answer.answer[editor.type].optionIndex;
                        console.log(choice);
                        if (typeof choice === 'number'){
                            for (var i = 0; i < data.length; i++){
                                console.log(data[i]);
                                console.log(data[i].index);
                                console.log(choice);
                                if(choice == data[i].index){
                                    data[i].value++;
                                }
                            }
                        }else {
                            for (var j = 0; j < choice.length; j++){
                                for (var i = 0; i < data.length; i++){
                                    console.log(data[i]);
                                    console.log(data[i].index);
                                    console.log(choice);
                                    if(choice[j] == data[i].index){
                                        data[i].value++;
                                    }
                                }
                            }
                        }

                        // data.push({
                        //     answer: question_answer.answer[editor.type]
                        // })
                    };
                    console.log(data);
                })

            };
            if (['score'].includes(editor.type)){
                let scores = [];
                let {scoreRange, scoreBegin} = editor;
                for (let n = 0; n < parseInt(scoreRange); n++) {
                        scores[n] = parseInt(scoreBegin)+n;
                        // console.log(typeof n);
                }
                scores.map((score, index) => {
                    data.push({
                        name: score,
                        value: 0,
                    })
                });
                console.log(data);
                this.state.answers.map((answer, index) =>{
                    let question_answer = JSON.parse(answer.content)[question_index];
                    if( question_answer.answer ){
                        let choice = question_answer.answer[editor.type];
                        for (var i = 0; i < data.length; i++){
                            if(choice == data[i].name){
                                data[i].value++;
                            }
                        }
                        // data.push({
                        //     answer: question_answer.answer[editor.type]
                        // })
                    };
                })

            }
            if (['text', 'textarea', 'input'].includes(editor.type)){
                this.state.answers.map((answer, index) =>{
                    let question_answer = JSON.parse(answer.content)[question_index];
                    console.log(question_answer);
                    if( question_answer.answer ){
                        data.push({
                            answer: question_answer.answer[editor.type]
                        })
                    };
                    console.log(data);
                })
            }

            return (
                <div style={{margin:'5px auto'}}>
                    <span style={{fontSize: 16}}>{index+1}. {editor.title}</span>
                    {['radio', 'dropdown', 'checkbox', 'score'].includes(editor.type) && <PieChart index={index} data={data}/>}
                    {['text', 'textarea', 'input'].includes(editor.type) && <Table style={{margin: '10px 10px'}} columns={this.state.text_columns} dataSource={data}/>}
                </div>
            );
        });
        return(
            <div>
                <MyHeader history={this.props.history}  uid={this.state.uid}/>
                <div style={{margin: '0 30px'}}>
                    <div>
                        <div style={{marginTop: '80px', display: 'flex', flex: 1, flexDirection: 'row'}}>
                            <span style={{fontSize: 30}}>{this.state.title}</span>
                            <div style={{marginTop: 10, marginLeft: 20, border: '1px solid #DBDBDB', height: 30, borderRadius: 30}}>
                                <span style={{margin: '0 10px'}}>
                                    问卷ID：{this.state.fid}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{margin: '20px 0', display: 'flex', flex: 1, flexDirection: 'row'}}>
                            <InfoCircleOutlined style={{fontSize: 27, color: '#34a4fc'}}/>
                            <span style={{margin: '0 10px', fontSize: 20}}>基本信息</span>
                        </div>
                        <div style={{boxShadow: '0px 0px 1px 0 gray', borderColor: '#34a4fc', padding: '10px 10px 5px 10px'}}>
                            <p style={{margin:'20px 30px', borderBottom: '1px solid #DBDBDB'}}><span>回收量</span><span style={{float: 'right'}}>{this.state.answers.length}</span></p>
                            <p style={{margin:'20px 30px', borderBottom: '1px solid #DBDBDB'}}><span>开始收集时间</span><span style={{float: 'right'}}>{this.state.begin_date}</span></p>
                            <p style={{margin:'20px 30px', borderBottom: '1px solid #DBDBDB'}}><span>结束收集时间</span><span style={{float: 'right'}}>{this.state.end_date}</span></p>
                        </div>
                    </div>
                    <div>
                        <div style={{margin: '20px 0', display: 'flex', flex: 1, flexDirection: 'row'}}>
                            <ContainerOutlined style={{fontSize: 27, color: '#34a4fc'}}/>
                            <span style={{margin: '0 10px', fontSize: 20}}>回收数据</span>
                        </div>
                        <div style={{boxShadow: '0px 0px 1px 0 gray', borderColor: '#34a4fc', padding: '10px 10px 5px 10px'}}>
                            <Table style={{ margin: '10px 10px'}} columns={this.state.columns} dataSource={this.state.answers} pagination={this.pagination}/>
                        </div>
                    </div>
                    <div>
                        <div style={{margin: '20px 0', display: 'flex', flex: 1, flexDirection: 'row'}}>
                            <PieChartOutlined style={{fontSize: 27, color: '#34a4fc'}}/>
                            <span style={{margin: '0 10px', fontSize: 20}}>统计图表</span>
                        </div>
                        <div style={{margin: '20px 0'}}>
                            <Card>
                                {questionBlock}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}