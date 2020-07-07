package com.bs.questionnair.controller;

import com.bs.questionnair.model.Form;
import com.bs.questionnair.service.FormService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/form")
public class FormController {
    @Resource
    FormService formService;

    @PostMapping(value="/new", consumes = "application/json")
    public int createForm(@RequestBody Form record) {
        System.out.println(record.toString());
        return formService.createForm(record);
    }

    @RequestMapping("/fill/{fid}")
    public Form getForm(@PathVariable String fid){
        return formService.getForm(Integer.parseInt(fid));
    }

    @RequestMapping("/{uid}")
    public List<Form> getFormByUser(@PathVariable String uid){
        System.out.println(uid);
        System.out.println(formService.getFormByUser(uid));
        return formService.getFormByUser(uid);
    }

    @PostMapping(value="/release", consumes = "application/json")
    public int releaseForm(@RequestBody Form record){
        System.out.println(formService.releaseForm(record));
        return formService.releaseForm(record);
    }

    @PostMapping(value="/stopRelease", consumes = "application/json")
    public int stopReleaseForm(@RequestBody Form record){
        System.out.println(formService.stopReleaseForm(record));
        return formService.stopReleaseForm(record);
    }
}
