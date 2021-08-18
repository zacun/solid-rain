package fr.univlyon1.m1if13.users;

import fr.univlyon1.m1if13.users.controller.OperationController;
import fr.univlyon1.m1if13.users.controller.UserController;
import static org.assertj.core.api.Java6Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

// Documentation des tests dans le README

@SpringBootTest
class UsersApplicationTests {

    @Autowired
    private UserController userController;
    
    @Autowired
    private OperationController operationController;
    
    @Test
    void contextLoads() {
        assertThat(userController).isNotNull();
        assertThat(operationController).isNotNull();
    }

}
