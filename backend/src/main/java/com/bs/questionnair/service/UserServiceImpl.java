package com.bs.questionnair.service;

import com.bs.questionnair.mapper.UserMapper;
import com.bs.questionnair.model.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    @Resource
    UserMapper userMapper;

    public List<User> listAll(){
        return userMapper.selectAll();
    }

//    @Override
//    public User getUser(Integer uid) {
//        User res = userMapper.selectOne(uid);
//        if (res == null){
//            User empty = new User(0000000, "0000000");
//            return empty;
//        }
//        return userMapper.selectOne(uid);
//    }

    @Override
    public int createUser(User record) {
        return userMapper.insert(record);
    }
}
