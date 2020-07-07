package com.bs.questionnair.controller;

import com.bs.questionnair.model.Answer;
import com.bs.questionnair.service.AnswerService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/answer")
public class AnswerController {
    @Resource
    AnswerService answerService;


    @PostMapping(value="/new", consumes = "application/json")
    public int createUser(@RequestBody Answer record) {
        System.out.println(record.toString());
        return answerService.createAnswer(record);
    }

    @RequestMapping(value="/{fid}")
    public List<Answer> getAnswerByForm(@PathVariable String fid){
        System.out.println(fid);
        return answerService.getAnswerByForm(Integer.parseInt(fid));
    }

    @RequestMapping(value="/num/{fid}")
    public int getAnswerNumByForm(@PathVariable String fid){
        System.out.println(fid);
        return answerService.getAnswerNumByForm(Integer.parseInt(fid));
    }

    @RequestMapping(value="/result/{aid}")
    public Answer getAnswer(@PathVariable String aid){
        System.out.println(answerService.getAnswer(Integer.parseInt(aid)));
        return answerService.getAnswer(Integer.parseInt(aid));
    }
}
