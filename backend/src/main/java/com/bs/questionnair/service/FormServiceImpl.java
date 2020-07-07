package com.bs.questionnair.service;

import com.bs.questionnair.mapper.FormMapper;
import com.bs.questionnair.model.Form;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class FormServiceImpl implements FormService{

    @Resource
    FormMapper formMapper;

    @Override
    public int createForm(Form record) {
        return formMapper.insert(record);
    }

    @Override
    public Form getForm(Integer fid) {
        Form tmp = formMapper.selectByPrimaryKey(fid);
        Date begin_date = tmp.getBeginDate();
        Date end_date = tmp.getEndDate();
        tmp.setBeginDateString(tmp.changeDateString(begin_date));
        tmp.setEndDateString(tmp.changeDateString(end_date));
        System.out.println(tmp);
        return tmp;
    }

    @Override
    public List<Form> getFormByUser(String uid) {
        List<Form> tmp = formMapper.selectByUser(uid);
        for (int i = 0; i < tmp.size(); i++){
            System.out.println(tmp.get(i).getAddDate());
            Date date = tmp.get(i).getAddDate();
//            System.out.println(date);
            String dateString = tmp.get(i).changeDateString(date);
            tmp.get(i).setAddDateString(dateString);
        }
        return tmp;
    }

    @Override
    public int releaseForm(Form record) {
        return formMapper.updateForRelease(record);
    }

    @Override
    public int stopReleaseForm(Form record) {
        return formMapper.updateForStopRelease(record);
    }
}
