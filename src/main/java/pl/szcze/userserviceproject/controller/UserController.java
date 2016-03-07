package pl.szcze.userserviceproject.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMethod;
import pl.szcze.userserviceproject.model.User;
import pl.szcze.userserviceproject.repository.UserRepository;

@RestController
@PreAuthorize("hasRole('USER')")
@RequestMapping("${spring.data.rest.base-path}/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<User>> list() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }

}
