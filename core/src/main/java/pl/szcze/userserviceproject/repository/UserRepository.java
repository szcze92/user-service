package pl.szcze.userserviceproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.szcze.userserviceproject.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

}
