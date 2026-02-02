# Spring


## Historique

| Période | Java LTS | Spring typique | Compatibilité / baseline | Configuration dominante |
|--------|----------|----------------|--------------------------|-------------------------|
| 2006–2010 | Java 6 | Spring 2.0–2.5 | Java 5/6 | XML uniquement (`applicationContext.xml`, `dispatcher-servlet.xml`) + `web.xml` |
| 2011–2013 | Java 7 | Spring 3.0–3.2 | Java 6/7 | Mix XML + JavaConfig (`@Configuration`), `web.xml` obligatoire |
| 2014–2017 | Java 8 | Spring 4.x / Boot 1.x | Java 8 | XML ou JavaConfig ; Boot introduit l’auto-configuration |
| 2018–2020 | Java 11 | Spring 5.0–5.3 / Boot 2.x | Baseline Java 8, prod souvent 11 | JavaConfig majoritaire, `web.xml` facultatif |
| 2021–2022 | Java 17 | Spring 6.0 / Boot 3.0 | Baseline Java 17 | JavaConfig uniquement, migration `javax` → `jakarta` |
| 2023–2024 | Java 21 | Spring 6.1 / Boot 3.2 | Baseline Java 17, support JDK 21 | JavaConfig / Boot, observabilité native |
| 2025+ | Java 25 | Spring 6.x | Support LTS 17 / 21 / 25 | JavaConfig, XML réservé au legacy |
