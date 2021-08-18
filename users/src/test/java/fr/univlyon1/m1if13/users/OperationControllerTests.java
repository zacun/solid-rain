/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.univlyon1.m1if13.users;

import org.junit.Assert;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Documentation des tests dans le README

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class OperationControllerTests {
    
    @Autowired
    private MockMvc mockMvc;
    
    private static String token;
    private String origin = "http://localhost";
    
    @Test
    @Order(1)
    public void loginAUser() throws Exception {
        MvcResult mvcResult = this.mockMvc.perform(post("/login").param("login", "user-test").param("password", "test").header("Origin", origin))        
            .andExpect(status().isNoContent())                        
            .andReturn();
        
        Assert.assertNotNull(mvcResult.getResponse().getHeader("Authorization"));
        token = mvcResult.getResponse().getHeader("Authorization");
    }
    
    @Test
    @Order(2)
    public void checkIfUserIsAuthenticated() throws Exception {
        String subToken = token.substring(7);
        this.mockMvc.perform(get("/authenticate").param("token", subToken).param("origin", origin).header("Origin", origin).header("Authorization", subToken))
            .andExpect(status().isNoContent())           
            .andReturn();
    }
    
    @Test
    @Order(3)
    public void logoutAUser() throws Exception {
        this.mockMvc.perform(delete("/logout").header("Authorization", token))
            .andExpect(status().isNoContent())
            .andReturn();     
    }
}
