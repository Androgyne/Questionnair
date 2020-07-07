package com.bs.questionnair.mapper;

import com.bs.questionnair.model.Form;

import java.util.List;

public interface FormMapper {
    int deleteByPrimaryKey(Integer fid);

    int insert(Form record);

    int insertSelective(Form record);

    Form selectByPrimaryKey(Integer fid);

    List<Form> selectByUser(String uid);

    int updateByPrimaryKeySelective(Form record);

    int updateByPrimaryKey(Form record);

    int updateForRelease(Form record);

    int updateForStopRelease(Form record);
}