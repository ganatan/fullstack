# 002-springboot-files.md — Spring Boot — Gestion de fichiers PDF (1 seul Controller)

## Objectif

- Application Spring Boot simple
- 1 seul controller avec tout le code
- Upload PDF, liste, métadonnées, download/stream, suppression
- Stockage sur disque (filesystem)

---

## Endpoints

- `POST /files/pdf` (multipart `file`) → upload PDF
- `GET /files` → liste des fichiers (métadonnées)
- `GET /files/{id}` → métadonnées d’un fichier
- `GET /files/{id}/content` → téléchargement/stream
- `DELETE /files/{id}` → suppression

---

## Controller unique

Créer le fichier :

`src/main/java/com/example/demo/FileController.java`

```java
package com.example.demo;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/files")
public class FileController {

  private final Path baseDir;
  private final long maxBytes;

  public FileController(
      @Value("${app.files.base-dir:./data/files}") String baseDir,
      @Value("${app.files.max-bytes:10485760}") long maxBytes) {

    this.baseDir = Paths.get(baseDir).toAbsolutePath().normalize();
    this.maxBytes = maxBytes;

    try {
      Files.createDirectories(this.baseDir);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "storage-init-failed");
    }
  }

  @PostMapping(value = "/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FileMeta uploadPdf(@RequestPart("file") MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "empty-file");
    }
    if (file.getSize() > maxBytes) {
      throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "file-too-large");
    }

    String original = StringUtils.hasText(file.getOriginalFilename()) ? file.getOriginalFilename() : "file.pdf";
    String safeName = sanitizeFilename(original);
    if (!safeName.toLowerCase().endsWith(".pdf")) {
      throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "not-a-pdf");
    }

    try (InputStream is = file.getInputStream()) {
      byte[] header = is.readNBytes(5);
      if (header.length < 5 || header[0] != '%' || header[1] != 'P' || header[2] != 'D' || header[3] != 'F' || header[4] != '-') {
        throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "invalid-pdf-header");
      }
    } catch (ResponseStatusException e) {
      throw e;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot-read-file");
    }

    String id = java.util.UUID.randomUUID().toString();
    Path target = baseDir.resolve(id + ".pdf").normalize();
    if (!target.startsWith(baseDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid-path");
    }

    try {
      file.transferTo(target);
      if (!Files.exists(target) || Files.size(target) == 0) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "write-failed");
      }
      String sha256 = sha256Hex(target);
      long size = Files.size(target);
      Instant createdAt = Instant.now();

      Path meta = baseDir.resolve(id + ".json");
      String json = toJson(Map.of(
          "id", id,
          "filename", safeName,
          "contentType", "application/pdf",
          "size", size,
          "sha256", sha256,
          "createdAt", createdAt.toString()
      ));
      Files.writeString(meta, json, StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);

      return new FileMeta(id, safeName, "application/pdf", size, sha256, createdAt.toString());
    } catch (ResponseStatusException e) {
      try { Files.deleteIfExists(target); } catch (Exception ignore) {}
      throw e;
    } catch (FileAlreadyExistsException e) {
      try { Files.deleteIfExists(target); } catch (Exception ignore) {}
      throw new ResponseStatusException(HttpStatus.CONFLICT, "id-collision");
    } catch (Exception e) {
      try { Files.deleteIfExists(target); } catch (Exception ignore) {}
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "upload-failed");
    }
  }

  @GetMapping
  public List<FileMeta> list() {
    try (Stream<Path> s = Files.list(baseDir)) {
      return s.filter(p -> p.getFileName().toString().endsWith(".json"))
          .sorted()
          .map(this::readMeta)
          .toList();
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "list-failed");
    }
  }

  @GetMapping("/{id}")
  public FileMeta getMeta(@PathVariable String id) {
    Path meta = baseDir.resolve(id + ".json").normalize();
    if (!meta.startsWith(baseDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid-id");
    }
    if (!Files.exists(meta)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-found");
    }
    return readMeta(meta);
  }

  @GetMapping("/{id}/content")
  public ResponseEntity<Resource> download(@PathVariable String id) {
    Path pdf = baseDir.resolve(id + ".pdf").normalize();
    Path meta = baseDir.resolve(id + ".json").normalize();
    if (!pdf.startsWith(baseDir) || !meta.startsWith(baseDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid-id");
    }
    if (!Files.exists(pdf) || !Files.exists(meta)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-found");
    }

    FileMeta m = readMeta(meta);

    try {
      Resource resource = new UrlResource(pdf.toUri());
      if (!resource.exists() || !resource.isReadable()) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-readable");
      }

      String filename = m.filename();
      String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
      String contentDisposition = "attachment; filename=\"" + filename.replace("\"", "") + "\"; filename*=UTF-8''" + encoded;

      return ResponseEntity.ok()
          .contentType(MediaType.APPLICATION_PDF)
          .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
          .header(HttpHeaders.ETAG, "\"" + m.sha256() + "\"")
          .contentLength(m.size())
          .body(resource);
    } catch (ResponseStatusException e) {
      throw e;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "download-failed");
    }
  }

  @DeleteMapping("/{id}")
  public Map<String, Object> delete(@PathVariable String id) {
    Path pdf = baseDir.resolve(id + ".pdf").normalize();
    Path meta = baseDir.resolve(id + ".json").normalize();
    if (!pdf.startsWith(baseDir) || !meta.startsWith(baseDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid-id");
    }
    try {
      boolean metaDeleted = Files.deleteIfExists(meta);
      boolean pdfDeleted = Files.deleteIfExists(pdf);
      if (!metaDeleted && !pdfDeleted) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-found");
      }
      return Map.of("id", id, "deleted", true);
    } catch (ResponseStatusException e) {
      throw e;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "delete-failed");
    }
  }

  private FileMeta readMeta(Path metaPath) {
    try {
      String json = Files.readString(metaPath, StandardCharsets.UTF_8);
      String id = getJsonString(json, "id");
      String filename = getJsonString(json, "filename");
      String contentType = getJsonString(json, "contentType");
      long size = Long.parseLong(getJsonString(json, "size"));
      String sha256 = getJsonString(json, "sha256");
      String createdAt = getJsonString(json, "createdAt");
      return new FileMeta(id, filename, contentType, size, sha256, createdAt);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "meta-read-failed");
    }
  }

  private static String sanitizeFilename(String v) {
    String s = v.replace("\\", "/");
    int idx = s.lastIndexOf('/');
    if (idx >= 0) s = s.substring(idx + 1);
    s = s.trim();
    s = s.replaceAll("[\\x00-\\x1F\\x7F\"<>|:*?]", "_");
    if (s.isBlank()) s = "file.pdf";
    return s;
  }

  private static String sha256Hex(Path file) {
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      try (DigestInputStream dis = new DigestInputStream(Files.newInputStream(file, StandardOpenOption.READ), md)) {
        dis.transferTo(java.io.OutputStream.nullOutputStream());
      }
      return HexFormat.of().formatHex(md.digest());
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "checksum-failed");
    }
  }

  private static String toJson(Map<String, Object> map) {
    StringBuilder sb = new StringBuilder();
    sb.append("{");
    boolean first = true;
    for (var e : map.entrySet()) {
      if (!first) sb.append(",");
      first = false;
      sb.append("\"").append(escapeJson(e.getKey())).append("\":");
      Object val = e.getValue();
      if (val instanceof Number || val instanceof Boolean) {
        sb.append(val);
      } else {
        sb.append("\"").append(escapeJson(String.valueOf(val))).append("\"");
      }
    }
    sb.append("}");
    return sb.toString();
  }

  private static String escapeJson(String s) {
    return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
  }

  private static String getJsonString(String json, String key) {
    String k = "\"" + key + "\":";
    int i = json.indexOf(k);
    if (i < 0) throw new IllegalArgumentException("missing-key:" + key);
    i += k.length();
    while (i < json.length() && Character.isWhitespace(json.charAt(i))) i++;
    if (i >= json.length()) throw new IllegalArgumentException("bad-json");
    char c = json.charAt(i);
    if (c == '"') {
      int j = i + 1;
      StringBuilder sb = new StringBuilder();
      while (j < json.length()) {
        char ch = json.charAt(j);
        if (ch == '\\') {
          if (j + 1 >= json.length()) break;
          char n = json.charAt(j + 1);
          if (n == 'n') sb.append('\n');
          else if (n == 'r') sb.append('\r');
          else if (n == 't') sb.append('\t');
          else sb.append(n);
          j += 2;
          continue;
        }
        if (ch == '"') break;
        sb.append(ch);
        j++;
      }
      return sb.toString();
    } else {
      int j = i;
      while (j < json.length() && json.charAt(j) != ',' && json.charAt(j) != '}') j++;
      return json.substring(i, j).trim();
    }
  }

  public record FileMeta(String id, String filename, String contentType, long size, String sha256, String createdAt) {}
}
```

---

## Configuration

Créer le fichier :

`src/main/resources/application.properties`

```properties
server.port=3000
app.files.base-dir=./data/files
app.files.max-bytes=10485760
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## Tests rapides (curl)

```bash
curl -F "file=@./document.pdf" http://localhost:3000/files/pdf
curl http://localhost:3000/files
curl http://localhost:3000/files/<ID>
curl -OJ http://localhost:3000/files/<ID>/content
curl -X DELETE http://localhost:3000/files/<ID>
```

---

## Structure créée à l’exécution

- `./data/files/<uuid>.pdf`
- `./data/files/<uuid>.json`
