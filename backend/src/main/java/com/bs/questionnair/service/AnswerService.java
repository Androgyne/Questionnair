package com.bs.questionnair.service;

import com.bs.questionnair.model.Answer;

import java.util.List;

public interface AnswerService {
    public int createAnswer(Answer record);
    public List<Answer> getAnswerByForm(Integer fid);
    public Answer getAnswer(Integer aid);

    int getAnswerNumByForm(Integer fid);
}
