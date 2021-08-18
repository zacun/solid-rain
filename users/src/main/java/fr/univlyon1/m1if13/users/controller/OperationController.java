package fr.univlyon1.m1if13.users.controller;

import fr.univlyon1.m1if13.users.dao.UserDao;
import com.auth0.jwt.exceptions.InvalidClaimException;
import fr.univlyon1.m1if13.users.utilities.JwtHelper;
import fr.univlyon1.m1if13.users.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("/")
public class OperationController {
    
    @Autowired
    private UserDao userDao;

    /**
     * Procédure de login "simple" d'un utilisateur
     * @param login Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @param origin
     * @return Une ResponseEntity avec le JWT dans le header "Authorization" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
     */
    @CrossOrigin(origins = {"http://localhost"})
    @PostMapping("/login")
    @Operation(summary = "Connecter un utilisateur",
        responses = {
                @ApiResponse(
                        responseCode = "404",
                        description = "Cet utilisateur n'existe pas"
                ),
                @ApiResponse(
                        responseCode = "401",
                        description = "Identifiants invalides"
                ),
                @ApiResponse(
                        responseCode = "201",
                        description = "Utilisateur créé"
                )}
    )
    public ResponseEntity<Void> login(
            @Parameter(description = "Le nom de l'utilisateur que vous voulez connecter", required = true) @RequestParam("login") String login,
            @Parameter(description = "Le mot de passe de l'utilisateur que vous voulez connecter", required = true) @RequestParam("password") String password,
            @Parameter(description = "Le header Origin contenant l'origine de la requête", required = true) @RequestHeader("Origin") String origin) {
        Optional<User> optU = userDao.get(login);
        if (optU == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cet utilisateur n'existe pas.");
        }
        User u = optU.get();
        try {
            u.authenticate(password);
        } catch (AuthenticationException ex) {
            Logger.getLogger(OperationController.class.getName()).log(Level.SEVERE, null, ex);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe invalide.");
        }
        if(u.isConnected()) {
            String token = JwtHelper.generateToken(login, password, true, origin);
            HttpHeaders responseHeaders = new HttpHeaders();            
            responseHeaders.set("Authorization", "Bearer "+token);
            responseHeaders.set("Access-Control-Expose-Headers", "Authorization");
            return new ResponseEntity<>(responseHeaders, HttpStatus.NO_CONTENT);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides.");
        }        
    }

    /**
     * Réalise la déconnexion
     * @param token
     * @return 
     */
    @CrossOrigin(origins = {"http://localhost"})
    @DeleteMapping("/logout")
    @Operation(summary = "Déconnecter un utilisateur",
        responses = {
                @ApiResponse(
                        description = "OK",
                        responseCode = "204"
                )
        }
    )
    public ResponseEntity<Void> logout(
            @Parameter(description = "Le header Authorization contenant le token de l'utilisateur à déconnecter", required = true) @RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String login = JwtHelper.getLoginFromToken(token);
        User u = userDao.get(login).get();
        u.disconnect();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Méthode destinée au serveur Node pour valider l'authentification d'un utilisateur.
     * @param token Le token JWT qui se trouve dans le header "Authorization" de la requète
     * @param origin L'origine de la requète (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @CrossOrigin(origins = {"http://localhost"})
    @GetMapping("/authenticate")
    @Operation(summary = "Authentifier un utilisateur",
        responses = {
                @ApiResponse(
                        description = "Identifiants invalides",
                        responseCode = "401"
                ),
                @ApiResponse(description = "OK",
                        responseCode = "204"
                ),
                @ApiResponse(
                        description = "Requête invalide",
                        responseCode = "400"
                )
        }
    )
    public ResponseEntity<Void> authenticate(
            @Parameter(description = "Le token de l'utilisateur à authentifier", required = true) @RequestParam("token") String token,
            @Parameter(description = "L'origine de la requête", required = true) @RequestParam("origin") String origin) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            JwtHelper.verifyToken(token, origin);
            JwtHelper.verifyConnected(token);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(InvalidClaimException e) {
            System.out.println("Exception : "+e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requête invalide.");
        } catch (Exception e) {
            System.out.println("Exception : "+e);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides.");
        }
    }
}
