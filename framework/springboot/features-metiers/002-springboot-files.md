# 007-springboot-open-pdf.md — springboot-starter-open-pdf

## Objectif

Un seul endpoint :

- `GET /api/files/{name}.pdf`

Le fichier est lu depuis :

- `./data/files/{name}.pdf`

Le navigateur l’ouvre (Content-Disposition: inline).

---

## Test

Un seul Test

```bash
mvn -Dtest=FileControllerTests test
```

---

## Dépendances

### Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Configuration

`src/main/resources/application.properties`

```properties
server.port=3000
```

---

## Controller

`src/main/java/com/ganatan/starter/api/files/FileController.java`

```java
package com.ganatan.starter.api.files;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileController {

    private final Path baseDir = Paths.get("./data/files").toAbsolutePath().normalize();

    @GetMapping("/api/files/{name}.pdf")
    public ResponseEntity<Resource> openPdf(@PathVariable String name) throws Exception {
        if (!name.matches("^[A-Za-z0-9._-]{1,120}$")) {
            return ResponseEntity.badRequest().build();
        }

        Path pdf = baseDir.resolve(name + ".pdf").normalize();
        if (!pdf.startsWith(baseDir) || !Files.exists(pdf)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(pdf.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String filename = name + ".pdf";
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"; filename*=UTF-8''" + encoded)
                .contentLength(Files.size(pdf))
                .body(resource);
    }
}
```

---

## Test

`src/test/java/com/ganatan/starter/api/files/FileControllerTests.java`

```java
package com.ganatan.starter.api.files;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FileControllerTests {

    @Autowired
    private MockMvc mvc;

    @BeforeEach
    void setup() throws Exception {
        Path dir = Path.of("data/files");
        Files.createDirectories(dir);
        Files.write(dir.resolve("test.pdf"), "%PDF-1.7\n%%EOF".getBytes(StandardCharsets.US_ASCII));
    }

    @Test
    void openPdf_ok() throws Exception {
        mvc.perform(get("/api/files/test.pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", MediaType.APPLICATION_PDF_VALUE))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("inline")))
                .andExpect(content().bytes("%PDF-1.7\n%%EOF".getBytes(StandardCharsets.US_ASCII)));
    }

    @Test
    void openPdf_notFound() throws Exception {
        mvc.perform(get("/api/files/missing.pdf"))
                .andExpect(status().isNotFound());
    }

    @Test
    void openPdf_badName() throws Exception {
        mvc.perform(get("/api/files/../secret.pdf"))
                .andExpect(status().isBadRequest());
    }
}
```

---

## Utilisation

1) Copier un PDF dans `./data/files/` (ex: `demarrer-avec-angular.pdf`)

2) Ouvrir :

- `http://localhost:3000/api/files/demarrer-avec-angular.pdf`
