package com.bs.questionnair.controller;

import com.bs.questionnair.model.User;
import com.bs.questionnair.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Resource
    UserService userService;

//    @RequestMapping(value = "/",method = RequestMethod.GET)
    @RequestMapping("/list")
    public List<User> list(){
        return userService.listAll();
    }

//    @RequestMapping("/{uid}")
//    public User getUser(@PathVariable Integer uid) {
//        return userService.getUser(uid);
//    }

    @PostMapping(value="/new", consumes = "application/json")
    public int createUser(@RequestBody User record) {
        System.out.println(record.toString());
        return userService.createUser(record);
    }
}
