package com.bs.questionnair.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import lombok.Data;

/**
 * answer
 * @author 
 */
@Data
public class Answer implements Serializable {
    private Integer aid;

    private Integer fid;

    private String uid;

    private Date date;

    private Object ip;

    private Object content;

    private String dateString;

    public String changeDateString(Date date){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date.getTime());
    };

    private static final long serialVersionUID = 1L;
}