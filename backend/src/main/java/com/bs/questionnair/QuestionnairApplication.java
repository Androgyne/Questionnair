package com.bs.questionnair;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.bs.questionnair.mapper")
public class QuestionnairApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestionnairApplication.class, args);
    }

}
