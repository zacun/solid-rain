/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.univlyon1.m1if13.users.model;

/**
 *
 * @author Leo
 */
public class UserDTO {
    private String login;
    private String password;
    // Permet d'invalider une connexion même si le token est toujours valide

    public UserDTO(String login, String password) {
        this.login = login;
        this.password = password;
    }

    public UserDTO() {}
    
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getPassword() {
        return password;
    }
}
