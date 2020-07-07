package com.bs.questionnair.model;

import java.io.Serializable;
import lombok.Data;

/**
 * user
 * @author 
 */
@Data
public class User implements Serializable {
    private String uid;

    private String password;

    private String email;

    private static final long serialVersionUID = 1L;
}