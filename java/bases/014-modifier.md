# Modifiers.md

## Code

```java
public class ModifiersExample {

  public static final String APP_NAME = "Demo";

  private int counter = 0;

  public void increment() {
    counter++;
  }

  public int getCounter() {
    return counter;
  }

  public static void printAppName() {
    System.out.println(APP_NAME);
  }

  private void resetCounter() {
    counter = 0;
  }

  public static void main(String[] args) {

    ModifiersExample example = new ModifiersExample();

    example.increment();
    example.increment();

    System.out.println(example.getCounter());

    ModifiersExample.printAppName();
  }
}
```
