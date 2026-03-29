```text
# DEV
http://localhost:3001
http://localhost:3001/test
http://localhost:3001/test-profile-controller
http://localhost:3001/test-mongodb-controller
http://localhost:3001/test-mongodb-config
http://localhost:3001/test-mongo-simple
http://localhost:3001/test-mongo-details
http://localhost:3001/test-mongo-details/Produit
http://localhost:3001/test-kafka-config
http://localhost:3001/test-kafka-connection
http://localhost:3001/test-kafka-topics
http://localhost:3001/test-mongodb-rest
http://localhost:3001/test-mongodb-service
http://localhost:3001//test-mongodb-implement
http://localhost:3001/test-mongodb-repository
```


# Rest
```java
package com.mvp.controller.mongodb.rest;

import java.time.Instant;

public class Media {

    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media() {
    }

    public Media(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}```



```java
package com.mvp.controller.mongodb.rest;

import java.time.Instant;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController {

    @GetMapping("/test-mongodb-rest")
    public List<Media> getMedias() {
        return List.of(
                new Media("M" +
                        "ED00001", "Dune", "Film", Instant.parse("2024-05-14T08:30:00.000Z")),
                new Media("MED00002", "Breaking Bad", "Serie", Instant.parse("2024-06-01T10:15:00.000Z"))
        );
    }
}
```



# Service
```java
package com.mvp.controller.mongodb.service;

import java.time.Instant;

public class Media1 {

    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media1() {
    }

    public Media1(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}
```

```java
package com.mvp.controller.mongodb.service;

import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MediaService1 {

    public List<Media1> getMedias() {
        return List.of(
                new Media1("MED00001", "Dune", "Film", Instant.parse("2024-05-14T08:30:00.000Z")),
                new Media1("MED00002", "Breaking Bad", "Serie", Instant.parse("2024-06-01T10:15:00.000Z"))
        );
    }
}
```

```java
package com.mvp.controller.mongodb.service;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController1 {

    private final MediaService1 mediaService;

    public MediaController1(MediaService1 mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/test-mongodb-service")
    public List<Media1> getMedias() {
        return mediaService.getMedias();
    }
}
```

# Implement
```java
package com.mvp.controller.mongodb.implement;

import java.time.Instant;

public class Media2 {

    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media2() {
    }

    public Media2(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}
```

```java
package com.mvp.controller.mongodb.implement;

import java.util.List;

public interface MediaService2 {
    List<Media2> getMedias();
}
```

```java
package com.mvp.controller.mongodb.implement;

import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MediaServiceImpl2 implements MediaService2 {

    @Override
    public List<Media2> getMedias() {
        return List.of(
                new Media2("MED00001", "Dune", "Film", Instant.parse("2024-05-14T08:30:00.000Z")),
                new Media2("MED00002", "Breaking Bad", "Serie", Instant.parse("2024-06-01T10:15:00.000Z"))
        );
    }
}
```

```java
package com.mvp.controller.mongodb.implement;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController2 {

    private final MediaService2 mediaService;

    public MediaController2(MediaService2 mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/test-mongodb-implement")
    public List<Media2> getMedias() {
        return mediaService.getMedias();
    }
}
```


# Repository

```java
package com.mvp.controller.mongodb.repository;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Media")
public class Media3 {

    @Id
    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media3() {
    }

    public Media3(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}
```

```java
package com.mvp.controller.mongodb.repository;

import java.util.List;

public interface MediaService3 {
    List<Media3> getMedias();
}
```

```java
package com.mvp.controller.mongodb.repository;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MediaServiceImpl3 implements MediaService3 {

    private final MediaRepository3 mediaRepository;

    public MediaServiceImpl3(MediaRepository3 mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public List<Media3> getMedias() {
        return mediaRepository.findAll();
    }
}
```

```java
package com.mvp.controller.mongodb.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MediaRepository3 extends MongoRepository<Media3, String> {
    List<Media3> findByType(String type);
}
```

```java
package com.mvp.controller.mongodb.repository;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController3 {

    private final MediaService3 mediaService;

    public MediaController3(MediaService3 mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/test-mongodb-repository")
    public List<Media3> getMedias() {
        return mediaService.getMedias();
    }
}
```
