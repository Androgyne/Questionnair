import React, {Component} from 'react';
import Input from '../../../libs/Input';
import {Layout} from 'antd';
import 'antd/dist/antd.css';
const { Header, Footer, Sider, Content } = Layout;

export default class FormContent extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            questionnairTitle: props.questionnairTitle,
            comment: props.comment
        }

        console.log(this.state.questionnairTitle);
        // this.testRef = React.createRef();
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeComment = this.handleChangeComment.bind(this);
    };
    // 新增题目时内容页滚动到底部
    componentDidUpdate() {
        // console.log('didiupdate');
        if (this.scrollBottom) {
            console.log(this.scrollBottom);
            const scrollHeight = this.content.scrollHeight;
            console.log(scrollHeight);
            console.log('this.page:'+this.page);
            this.page.scrollTo(0, scrollHeight);
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isFirst) {
            this.scrollBottom = true;
        } else {
            this.scrollBottom = false;
        };
    }

    handleChange=(e)=>{
        this.setState({
            questionnairTitle: e.target.value,
        });
        // console.log(this.state.questionnairTitle);
        this.props.onChangeTitle(this.state.questionnairTitle);
    }

    handleChangeComment=(e)=>{
        this.setState({
            comment: e.target.value,
        });
        // console.log(this.state.questionnairTitle);
        this.props.onChangeComment(this.state.comment);
    }

    handleBlur=()=>{
        const {
            onBlurTitle
        } = this.props;
        if (onBlurTitle) {
            onBlurTitle(this.state.questionnairTitle);
        };
    }

    render() {
        const {
            questionnairTitle,
            comment
        } = this.state;
        // console.log(questionnairTitle);
        // console.log(comment);
        // console.log(questionnairTitle);
        const questionnairtitleEl = (
            <div style={{width: '100%', height: 45, margin:'0, auto', display: 'flex', justifyContent: 'center', border:'1px solid transparent', alignItems:'center'}}>
                <Input
                    value={questionnairTitle}
                    onChange={this.handleChange}
                    // onBlur={this.handleBlur}
                    style={{
                        height: 45,
                        borderColor: 'transparent',
                        textAlign: 'center',
                        fontSize: 18,
                        color: '#666',
                        fontFamily: 'PingFangSC-Medium'
                    }}
                    width='90%'/>
            </div>
        );

        const commentEl = (
            <div style={{width: '100%', height: 45, margin:'0, auto', display: 'flex', justifyContent: 'center', border:'1px solid transparent', alignItems:'center'}}>
                <Input
                    value={comment}
                    onChange={this.handleChangeComment}
                    onBlur={this.handleBlur}
                    style={{
                        height: 40,
                        borderColor: 'transparent',
                        textAlign: 'center',
                        fontSize: 15,
                        color: '#666',
                        fontFamily: 'PingFangSC-Medium'
                    }}
                    width='90%'/>
            </div>
        );
        return (
            // <Content style={{flex: 1, backgroundColor: '#fff', boxShadow: '0 3px 4px 0 rgba(202,202,202,0.50)' ,width:'80vh', padding: '0px 10px 10px 10px', minHeight: '80vh'}} ref={el => this.page = el}>
            <div style={{
                    flex: 1,
                    position: 'absolute',
                    right: 80,
                    left: 500,
                    backgroundColor: 'white',
                    marginTop: 25,
                    marginLeft:15,
                    height: 500,
                    minHeight: 850,
                    overflow: 'auto',
                    width: 900}}
                 ref={el => this.page = el}>
                <div style={{
                    margin: '5px 0',
                    width: '100%',
                    padding: '10px 0',
                    borderTop: '1px solid transparent',
                    borderBottom: '1px solid transparent'}}>
                        {questionnairtitleEl}
                </div>
                <div style={{
                    margin: '5px 0',
                    width: '100%',
                    padding: '5px 0',
                    borderTop: '1px solid transparent',
                    borderBottom: '1px solid transparent'}}>
                        {commentEl}
                </div>
                <div ref={el => this.content = el}>
                    {/*如果组件没有子节点，this.props.children返回false*/}
                    {this.props.children || (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:'center',
                            flexDirection: 'column',
                            position:'absolute',
                            top: '45%',
                            left: '30%'}}>
                            <div style={{fontSize: 16, color: '#34a4fc'}}>您还没有添加题目哦，请点击左侧控件开始出题吧</div>
                        </div>
                    )}
                </div>
            {/*</Content>*/}
            </div>
        );
    }
}
