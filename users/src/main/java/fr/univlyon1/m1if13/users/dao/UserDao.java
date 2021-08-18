package fr.univlyon1.m1if13.users.dao;

import fr.univlyon1.m1if13.users.model.User;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class UserDao implements Dao<User> {
    
    private List<User> users = new ArrayList<>();
    
    public UserDao() {
        users.add(new User("user-test", "test"));
        users.add(new User("prof", "prof"));
    }
    
    public List<User> getAllUsers() {
        return users;
    }

    @Override
    public Optional<User> get(String id) {
        for (User u : users) {
            if (u.getLogin().equals(id)) return Optional.ofNullable(u);
        }
        return null;
    }

    @Override
    public Set<String> getAll() {
        Set<String> logins = new HashSet<>();
        for (User u : users) {
            logins.add(u.getLogin());
        }
        return logins;
    }

    @Override
    public void save(User u) {
        users.add(u);
    }

    @Override
    public void update(User u, String[] params) {
        if (params[0] != null && !params[0].equals("")) {
            u.setLogin(params[0]);
        }
        if (params[1] != null && !params[1].equals("")) {
            u.setPassword(params[1]);
        }
        users.add(u);
    }

    @Override
    public void delete(User u) {
        users.remove(u);
    }
}