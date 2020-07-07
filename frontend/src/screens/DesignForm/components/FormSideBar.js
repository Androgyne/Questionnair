import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Button, Space } from 'antd';
import {
    CheckCircleOutlined,
    CheckSquareOutlined,
    DownSquareOutlined,
    MinusSquareOutlined,
    MenuOutlined ,
    NumberOutlined,
    StarOutlined
} from "@ant-design/icons";
const { Sider } = Layout;



const subjects = [{
    name: '单选题',
    type: 'radio',
    icon: 'CheckCircleOutlined'
}, {
    name: '下拉题',
    type: 'dropdown',
}, {
    name: '多选题',
    type: 'checkbox',
}, {
    name: '单行文本题',
    type: 'text',
}, {
    name: '多行文本题',
    type: 'textarea',
}, {
    name: '数字填空题',
    type: 'input',
}, {
    name: '评分题',
    type: 'score',
}];



export default class FormSideBar extends React.Component {
    // handleClick = e => {
    //     console.log('click ', e);
    // };
    selectIcon(type){
        switch(type){
            case 'radio':
                return (<CheckCircleOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'dropdown':
                return (<DownSquareOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'checkbox':
                return (<CheckSquareOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'text':
                return (<MinusSquareOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'textarea':
                return (<MenuOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'input':
                return (<NumberOutlined style={{float: 'left', fontSize: 20}}/>);
            case 'score':
                return (<StarOutlined style={{float: 'left', fontSize: 20}}/>)
        }


    }
    render() {
        const {
            onSelectEditor
        } = this.props;
        return (
                <Sider style={{backgroundColor: 'white', marginTop: 25, marginLeft: 15, height: 500, minHeight: 850, width: 200, justifyContent: 'center'}} align={'center'}>
                    <Space style={{marginTop: 30}} direction="vertical" align={'center'}>
                        {subjects.map((data, index) => {
                            return (
                                <Button
                                    style={{margin: 6, width: 168, height:40, borderColor:'#34a4fc'}}
                                    key={index}
                                    size='large'
                                    onClick={() => onSelectEditor(data.type)}>
                                        {this.selectIcon(data.type)}
                                        {data.name}
                                </Button>
                            )
                        })}
                    </Space>
                </Sider>

        );
    }
}
