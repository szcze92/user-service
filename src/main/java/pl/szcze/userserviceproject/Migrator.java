package pl.szcze.userserviceproject;

import org.flywaydb.core.Flyway;

public class Migrator {

    public static void main(String[] args) {
        Flyway flyway = new Flyway();
        flyway.setDataSource("url", "user", "password");
        flyway.migrate();
    }

}
