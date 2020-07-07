import React from 'react';
import FormAnswer from "./components/FormAnswer";

export default class FormResult extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            aid: this.props.match.params.aid,
            answers:[]
        }
    }

    async componentDidMount(){
        const response = await fetch('/answer/result/' + this.state.aid);
        console.log(response);
        // console.log(response.json());
        const body = await response.json();
        console.log(body);
        this.setState({answers: JSON.parse(body.content)});
    }

    render() {
        console.log(this.state.answers);
        const results = this.state.answers.map((answer, index) => {
            return (
                <FormAnswer answer={answer} index={index}/>
            )
        })
        return(
            <div>
                {results}
            </div>
        )
    }
}