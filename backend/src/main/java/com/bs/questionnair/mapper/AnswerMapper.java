package com.bs.questionnair.mapper;

import com.bs.questionnair.model.Answer;

import java.util.List;

public interface AnswerMapper {
    int deleteByPrimaryKey(Integer aid);

    int insert(Answer record);

    int insertSelective(Answer record);

    Answer selectByPrimaryKey(Integer aid);

    List<Answer> selectByForm(Integer fid);

    int selectNumByForm(Integer fid);

    int updateByPrimaryKeySelective(Answer record);

    int updateByPrimaryKey(Answer record);
}