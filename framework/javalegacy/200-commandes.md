
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




## Appli et Lib Interne et externe

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
java -jar filetxtlib.jar

```


