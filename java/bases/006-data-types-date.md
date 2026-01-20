# Java – data types date / time (exhaustif)

---

## Code

```java
package com.ganatan.starter.api.root;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.Duration;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Calendar;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/data-types-date")
  public Map<String, Object> root() {

    Date legacyDate = new Date();
    Calendar legacyCalendar = Calendar.getInstance();

    Instant instant = Instant.now();

    LocalDate localDate = LocalDate.now();
    LocalTime localTime = LocalTime.now();
    LocalDateTime localDateTime = LocalDateTime.now();

    ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Europe/Paris"));
    OffsetDateTime offsetDateTime = OffsetDateTime.now(ZoneOffset.ofHours(2));
    OffsetTime offsetTime = OffsetTime.now(ZoneOffset.ofHours(2));

    Duration duration = Duration.of(90, ChronoUnit.MINUTES);
    Period period = Period.of(1, 2, 10);

    return Map.of(
      "legacy", Map.of(
        "Date", legacyDate.toString(),
        "Calendar", legacyCalendar.getTime().toString()
      ),
      "instant", instant.toString(),
      "local", Map.of(
        "LocalDate", localDate.toString(),
        "LocalTime", localTime.toString(),
        "LocalDateTime", localDateTime.toString()
      ),
      "zone", Map.of(
        "ZonedDateTime", zonedDateTime.toString(),
        "OffsetDateTime", offsetDateTime.toString(),
        "OffsetTime", offsetTime.toString()
      ),
      "duration", duration.toString(),
      "period", period.toString()
    );
  }
}
```

---

## Résumé

- `Date`, `Calendar` : API legacy, mutable, à éviter
- `Instant` : timestamp UTC
- `LocalDate` : date sans heure ni timezone
- `LocalTime` : heure sans date
- `LocalDateTime` : date + heure sans timezone
- `ZonedDateTime` : date + heure + timezone
- `OffsetDateTime` / `OffsetTime` : date/heure avec offset fixe
- `Duration` : durée basée sur le temps
- `Period` : durée basée sur le calendrier
