import React from 'react';

const FormAnswer = ({answer, index}) => {
    // console.log(typeof answer.answer[answer.type]);
    return (
        <div style={{ minHeight: 60 }}>
            <div style={{ color: '#666' }}>{`${index + 1}.${answer.title + ':'}`}</div>
                <div>{typeof answer.answer !=='undefined' ? (
                    <div style={{ paddingLeft: 12, color: '#151515' }}>{typeof answer.answer[answer.type] !== 'string'&& typeof answer.answer[answer.type] !== 'number' ? (
                        typeof answer.answer[answer.type].optionValue !== 'string' ? (
                            answer.answer[answer.type].optionValue.map((item, index) => {
                                return (
                                    item && <span key={index} style={{ marginRight: 15 }}>{item}</span>
                                )
                            })
                        ) : answer.answer[answer.type].optionValue
                    ) : answer.answer[answer.type]}</div>
                ): '未作答'}</div>
        </div>
    );
}

export default FormAnswer;