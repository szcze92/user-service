package pl.szcze.userserviceproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMethod;
import pl.szcze.userserviceproject.repository.UserRepository;

@RestController

@RequestMapping("${spring.data.rest.base-path}/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<String> list() {
        return new ResponseEntity<>("Siema", HttpStatus.OK);
    }

}
