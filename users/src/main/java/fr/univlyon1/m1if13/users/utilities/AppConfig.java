package fr.univlyon1.m1if13.users.utilities;

import fr.univlyon1.m1if13.users.dao.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public UserDao userDao() {
        return new UserDao();
    }
    
}