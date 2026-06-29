
## Appli et Lib Interne

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("Main:");
    FileTxtLib fileTxtLib = new FileTxtLib();
    fileTxtLib.show();
  }

}

public class FileTxtLib {

  FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  void show() {
    System.out.println("FileTxtLib:show");
  }

}
```

```bash
java -version
```


```bash
javac *.java
java Main
```


```bash
javac *.java
jar cfe filetxtlib.jar Main *.class
jar tf filetxtlib.jar
java -jar filetxtlib.jar
```



## Appli et Lib Interne et externe 2 jars

```java
import org.apache.commons.lang3.StringUtils;

public class Main {

  public static void main(String[] args) {

    System.out.println("Main:");

    FileTxtLib fileTxtLib = new FileTxtLib();

    fileTxtLib.show();

    String value = "   ";

    System.out.println(
        "StringUtils.isBlank = " +
            StringUtils.isBlank(value)
    );

  }

}
```


```bash
javac -cp ".\lib\*" *.java
java -cp ".;.\lib\*" Main
```

```bash
javac -cp ".\lib\*" *.java
jar cfe filetxtlib.jar Main *.class
jar tf filetxtlib.jar
java -cp "filetxtlib.jar;.\lib\*" Main
```




## Appli et Lib Interne et externe 1 seul jar

```bash
javac -cp ".\lib\*" *.java
jar xf .\lib\commons-lang3-3.12.0.jar
jar cfe filetxtlib-fat.jar Main *.class org
jar tf filetxtlib-fat.jar
java -jar filetxtlib-fat.jar
```