package fr.univlyon1.m1if13.users.controller;

import fr.univlyon1.m1if13.users.model.User;
import fr.univlyon1.m1if13.users.dao.UserDao;
import fr.univlyon1.m1if13.users.model.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RestController
@EnableWebMvc
public class UserController implements WebMvcConfigurer {
    
    @Autowired
    private UserDao userDao;
    
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.valueOf(MediaType.APPLICATION_JSON_VALUE));
    }
    
    @CrossOrigin(origins = {"http://localhost"})
    @GetMapping(path = "/users/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @Operation(summary = "Obtenir un utilisateur",
        responses = {
                @ApiResponse(
                        description = "Cet utilisateur n'existe pas",
                        responseCode = "404"
                ),
                @ApiResponse(description = "OK",
                        responseCode = "200"
                )}
    )
    public ResponseEntity<User> getUser(@Parameter(description = "Le nom de l'utilisateur que vous voulez obtenir", required = true) @PathVariable String id) {
        Optional<User> opt = userDao.get(id);
        if (opt == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cet utilisateur n'existe pas.");
        } else {
            User u = opt.get();
            return new ResponseEntity<>(u, HttpStatus.OK);
        }
    }
    
    @GetMapping(value = "/users/{id}", produces = {MediaType.TEXT_HTML_VALUE})
    @Operation(summary = "Obtenir un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "404",
                        description = "Cet utilisateur n'existe pas"
                ),
                @ApiResponse(
                        responseCode = "200",
                        description = "OK",
                        content = @Content(mediaType = "text/html",
                                examples = @ExampleObject(value=
                                "<h1>User : <span>user</span></h1>\n<p>Connected : <span>false</span></p>\n"))
                )}
    )
    public ModelAndView getUser(@Parameter(description = "Le nom de l'utilisateur que vous voulez obtenir", required = true) @PathVariable String id, Model model) {
        ModelAndView modelAndView = new ModelAndView();
        Optional<User> opt = userDao.get(id);
        if (opt == null) {
            modelAndView.setViewName("error");
            model.addAttribute("code", 404);
            model.addAttribute("message", "Cet utilisateur n'existe pas");
        } else {
            modelAndView.setViewName("user");
            User user = userDao.get(id).get();      
            model.addAttribute("user", user);            
        }
        return modelAndView;
    }
    
    @PostMapping(path = "/users", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Operation(summary = "Créer un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Vous devez renseigner le login et le password."
                ),
                @ApiResponse(
                        responseCode = "201",
                        description = "Utilisateur créé"
                )}
    )
    public ResponseEntity<Void> createUser(
            @Parameter(description="Les données de l'utilisateur que vous souhaitez créer", required=true, schema=@Schema(implementation = User.class)) @Valid User user) {
        if (user.getLogin() == null || user.getLogin().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous devez renseigner le login et le password.");
        } else {
            String login = user.getLogin();
            if (userDao.get(login) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il existe déjà un utilisateur avec ce login");
            }
            userDao.save(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
    }
    
    @PostMapping(path = "/users", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Vous devez renseigner le login et le password."
                ),
                @ApiResponse(
                        responseCode = "201",
                        description = "Utilisateur créé"
                )}
    )
    public ResponseEntity<Void> createUserJSON(
            @Parameter(description="Les données de l'utilisateur que vous souhaitez créer", required=true, schema=@Schema(implementation = User.class)) @Valid @RequestBody User user) {
        if (user.getLogin() == null || user.getLogin().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous devez renseigner le login et le password.");
        } else {
            String login = user.getLogin();
            if (userDao.get(login) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il existe déjà un utilisateur avec ce login");
            }
            userDao.save(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
    }
    
    @PutMapping(path = "/users/{id}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Operation(summary = "Modifier un utilisateur",
            description = "En format x-www-url-encoded, la requête doit être de la forme login=string&password=string",
            responses = {
                    @ApiResponse(
                            responseCode = "404",
                            description = "Utilisateur introuvable"
                    ),
                    @ApiResponse(
                            responseCode = "200",
                            description = "Utilisateur modifié"
                    )}
    )
    public ResponseEntity<Void> updateUser(
            @Parameter(description = "Le nom de l'utilisateur que vous voulez modifier", required = true) @PathVariable String id,
            @RequestBody(required = true) MultiValueMap params) {
        Optional<User> opt = userDao.get(id);
        if (opt == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cet utilisateur n'existe pas.");
        } else {
            String[] values = new String[2];
            String login, password;
            if (params.getFirst("login") != null) {
                login = String.valueOf(params.getFirst("login"));
                password = String.valueOf(params.getFirst("password"));
            } else if (params.getFirst("all") != null) {
                String tmp = params.getFirst("all").toString();
                String[] tab = tmp.split("&");
                login = tab[0].substring(6);
                password = tab[1].substring(9);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Format de la requête incorrecte (la requête doit être du type login=string&password=string");
            }
            if (login != null && !login.equals("")) {
                values[0] = login;
            } else {
                values[0] = null;
            }
            if (password != null && !password.equals("")) {
                values[1] = password;
            } else {
                values[1] = null;
            }
            userDao.update(opt.get(), values);            
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
    
    @PutMapping(path = "/users/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Modifier un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "404",
                        description = "Utilisateur introuvable"
                ),
                @ApiResponse(
                        responseCode = "200",
                        description = "Utilisateur modifié"
                )}
    )
    public ResponseEntity<Void> updateUserJSON(
            @Parameter(description = "Le nom de l'utilisateur que vous voulez modifier", required = true) @PathVariable String id,
            @Parameter(description="User to update. Cannot null or empty.", required=true, schema=@Schema(implementation = UserDTO.class)) @Valid @RequestBody UserDTO user) {
        Optional<User> opt = userDao.get(id);        
        if (opt == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cet utilisateur n'existe pas.");
        } else {
            if (userDao.get(user.getLogin()) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il existe déjà un utilisateur avec ce login");
            }
            String[] infos = new String[2];
            infos[0] = user.getLogin();
            infos[1] = user.getPassword();
            userDao.update(opt.get(), infos);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Supprimer un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "404",
                        description = "Utilisateur introuvable"
                ),
                @ApiResponse(
                        responseCode = "200",
                        description = "Utilisateur supprimé"
                )}
    )
    public ResponseEntity<Void> deleteUser(@Parameter(description = "Le nom de l'utilisateur que vous voulez supprimer", required = true) @PathVariable String id) {
        Optional<User> opt = userDao.get(id);
        if (opt == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cet utilisateur n'existe pas.");
        } else {
            userDao.delete(opt.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
