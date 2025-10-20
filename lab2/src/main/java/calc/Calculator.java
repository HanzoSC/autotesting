package calc;

public abstract class Calculator {
    protected int a, b;

    public Calculator(int a, int b) {
        this.a = a;
        this.b = b;
    }

    public abstract int execute();

    public static class Addition extends Calculator {
        public Addition(int a, int b) { super(a, b); }
        @Override
        public int execute() { return a + b; }
    }

    public static class Subtraction extends Calculator {
        public Subtraction(int a, int b) { super(a, b); }
        @Override
        public int execute() { return a - b; }
    }

    public static class Multiplication extends Calculator {
        public Multiplication(int a, int b) { super(a, b); }
        @Override
        public int execute() { return a * b; }
    }

    public static class Division extends Calculator {
    public Division(int a, int b) { super(a, b); }

    @Override
    public int execute() {
        if (b == 0) {
            throw new ArithmeticException("Деление на ноль");
        }
        return a / b;
        }
    }
}
