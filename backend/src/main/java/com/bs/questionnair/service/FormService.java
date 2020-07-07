package com.bs.questionnair.service;

import com.bs.questionnair.model.Form;

import java.util.List;

public interface FormService {
    public int createForm(Form record);
    public Form getForm(Integer fid);
    public List<Form> getFormByUser(String uid);
    public int releaseForm(Form record);

    int stopReleaseForm(Form record);
}
