import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';

export default class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            index: props.index,
            data: props.data
        }
    }
    componentDidMount() {
        // 初始化
        // let data = [
        //     {
        //         name: '章',
        //         value: 400
        //     },
        //     {
        //         name: '张',
        //         value: 1000
        //     },
        //     {
        //         name: '李',
        //         value: 42990
        //     }
        // ]


        let id = 'chart' + this.state.index;
        var myChart = echarts.init(document.getElementById(id));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: '选项',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: this.state.data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
    }

    render() {
        let id = 'chart' + this.state.index;
        return (
            <div id={id} style={{ width: '100%', height: 500 }}></div>
        );
    }
}