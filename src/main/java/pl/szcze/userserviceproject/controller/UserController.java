package pl.szcze.userserviceproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import pl.szcze.userserviceproject.repository.UserRepository;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/user")
    public ResponseEntity<String> list() {
        return new ResponseEntity<>("Siema", HttpStatus.OK);
    }

}
