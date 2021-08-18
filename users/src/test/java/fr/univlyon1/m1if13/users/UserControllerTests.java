/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.univlyon1.m1if13.users;

import org.springframework.http.MediaType;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Documentation des tests dans le README

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class UserControllerTests {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @Order(3)
    public void getUserWithPathVariable_thenVerifyResponseWithJSON() throws Exception {
        MvcResult mvcResult = this.mockMvc.perform(get("/users/{id}","user-test"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.login").value("user-test"))            
            .andReturn();

        Assert.assertEquals("application/json", 
            mvcResult.getResponse().getContentType());
    }
    
    @Test
    @Order(4)
    public void getUserWithPathVariable_thenVerifyResponseWithXML() throws Exception {
        MvcResult mvcResult = this.mockMvc.perform(get("/users/{id}","Bob").accept(MediaType.APPLICATION_XML_VALUE))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_XML))
            .andExpect(xpath("User/login").string("Bob"))            
            .andReturn();
        
        Assert.assertEquals("application/xml", 
          mvcResult.getResponse().getContentType());
    }
    
    @Test
    @Order(6)
    public void getUserWithPathVariable_thenVerifyResponseWithHTML() throws Exception {
        MvcResult mvcResult = this.mockMvc.perform(get("/users/{id}","Ted").accept(MediaType.TEXT_HTML_VALUE))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andExpect(view().name("user"))
            .andReturn();
        
        Assert.assertEquals("text/html;charset=UTF-8", 
          mvcResult.getResponse().getContentType());
    }
    
    @Test
    @Order(2)
    public void createUserWithPostAndJSON_thenVerifyResponse() throws Exception {
        this.mockMvc.perform(post("/users")
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content("{\"login\":\"Bob\",\"password\":\"string\",\"connected\":false}"))
        .andExpect(status().isCreated())
        .andReturn();
    }
    
    @Test
    @Order(1)
    public void createUserWithPostAndURLEncoded_thenVerifyResponse() throws Exception {
        this.mockMvc.perform(post("/users")
        .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
        .content("login=test&password=mdp&connected=false"))
        .andExpect(status().isCreated());
        
        this.mockMvc.perform(get("/users/{id}","test"))
        .andExpect(status().isOk())
        .andReturn();
    }
    
    @Test
    @Order(5)
    public void updateUserWithPutAndJSON_thenVerifyResponse() throws Exception {
        this.mockMvc.perform(put("/users/{id}", "test")
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content("{\"login\":\"Ted\",\"password\":\"string\"}"))
        .andExpect(status().isOk());
        
        this.mockMvc.perform(get("/users/{id}","Ted"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.login").value("Ted"))
        .andReturn();
    }
    
    @Test
    @Order(7)
    public void getWrongUser() throws Exception {
        this.mockMvc.perform(get("/users/{id}", "Robert").accept(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(status().isNotFound())
            .andReturn();    
    }
    
    @Test
    @Order(8)
    public void updateUserWithPutAndURLEncoded_thenVerifyResponse() throws Exception {
        this.mockMvc.perform(put("/users/{id}", "Ted")
        .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
        .content("login=Teddy&password=mdp"))
        .andExpect(status().isOk());
        
        this.mockMvc.perform(get("/users/{id}","Teddy"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.login").value("Teddy"))
        .andReturn();
    }
}
