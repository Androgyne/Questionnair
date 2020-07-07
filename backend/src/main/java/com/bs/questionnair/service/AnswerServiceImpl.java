package com.bs.questionnair.service;

import com.bs.questionnair.mapper.AnswerMapper;
import com.bs.questionnair.model.Answer;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class AnswerServiceImpl implements AnswerService{
    @Resource
    AnswerMapper answerMapper;

    @Override
    public int createAnswer(Answer record) {
        return answerMapper.insert(record);
    }

    @Override
    public List<Answer> getAnswerByForm(Integer fid) {
        System.out.println(answerMapper.selectByForm(fid));
        List<Answer> tmp = answerMapper.selectByForm(fid);
        for (int i = 0; i < tmp.size(); i++){
//            System.out.println(tmp.get(i).getDate());
            Date date = tmp.get(i).getDate();
            String dateString = tmp.get(i).changeDateString(date);
            tmp.get(i).setDateString(dateString);
        }
        return tmp;
    }

    @Override
    public Answer getAnswer(Integer aid) {
        return answerMapper.selectByPrimaryKey(aid);
    }

    @Override
    public int getAnswerNumByForm(Integer fid) {
        return answerMapper.selectNumByForm(fid);
    }
}
