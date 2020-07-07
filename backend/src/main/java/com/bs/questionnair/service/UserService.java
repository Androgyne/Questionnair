package com.bs.questionnair.service;

import com.bs.questionnair.model.User;

import java.util.List;

public interface UserService {
    public List<User> listAll();

//    public User getUser(Integer uid);

    public int createUser(User record);
}
