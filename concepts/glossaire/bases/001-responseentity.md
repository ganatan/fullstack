# 001-responseentity.md — ResponseEntity (Spring) — définition + exemple

## Définition

`ResponseEntity<T>` (package `org.springframework.http`) représente la **réponse HTTP complète**.

Il permet de contrôler explicitement :

- le **status HTTP** (200, 400, 404, 500…)
- les **headers** (Content-Type, Content-Disposition, Cache-Control…)
- le **body** (`T` : String, JSON, Resource, byte[], etc.)

---

## Exemple (servir un PDF en inline)

```java
@GetMapping("/api/files/{name}.pdf")
public ResponseEntity<Resource> openPdf(@PathVariable String name) throws Exception {
    Path pdf = baseDir.resolve(name + ".pdf").normalize();
    if (!Files.exists(pdf)) {
        return ResponseEntity.notFound().build();
    }

    Resource resource = new UrlResource(pdf.toUri());

    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
            .body(resource);
}
```

- Si le fichier existe : `200 OK` + `Content-Type: application/pdf` + body = PDF
- Sinon : `404 Not Found`
