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

