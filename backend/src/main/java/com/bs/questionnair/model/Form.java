package com.bs.questionnair.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import lombok.Data;

/**
 * form
 * @author 
 */
@Data
public class Form implements Serializable {
    private Integer fid;

    private String uid;

    private String title;

    private Object info;

    private Integer state;

    private Date addDate;

    private Date beginDate;

    private Date endDate;

    private String addDateString;

    private String beginDateString;

    private String endDateString;

    public String changeDateString(Date date){

        if (date == null) {
            String emptyString = new String();
            return emptyString;
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date.getTime());
    };

    private static final long serialVersionUID = 1L;
}