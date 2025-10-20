package calc;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== Калькулятор ===");
        System.out.println("Выберите систему счисления:");
        System.out.println("1 - Двоичная");
        System.out.println("2 - Восьмеричная");
        System.out.println("3 - Десятичная");
        System.out.println("4 - Шестнадцатеричная");

        int baseChoice = sc.nextInt();
        int base;
        switch (baseChoice) {
            case 1: base = 2; break;
            case 2: base = 8; break;
            case 3: base = 10; break;
            case 4: base = 16; break;
            default: base = 10; break;
        }

        sc.nextLine(); // очистка буфера

        System.out.print("Введите первое число: ");
        String num1Str = sc.nextLine();
        System.out.print("Введите второе число: ");
        String num2Str = sc.nextLine();

        int num1 = Integer.parseInt(num1Str, base);
        int num2 = Integer.parseInt(num2Str, base);

        System.out.print("Выберите операцию (+, -, *, /): ");
        String op = sc.nextLine();

        Calculator calculator = switch (op) {
            case "+" -> new Calculator.Addition(num1, num2);
            case "-" -> new Calculator.Subtraction(num1, num2);
            case "*" -> new Calculator.Multiplication(num1, num2);
            case "/" -> new Calculator.Division(num1, num2);
            default -> {
                System.out.println("Неверная операция!");
                yield null;
            }
        };

        if (calculator != null) {
            int result = calculator.execute();
            String resultStr = switch (base) {
                case 2 -> Integer.toBinaryString(result);
                case 8 -> Integer.toOctalString(result);
                case 10 -> Integer.toString(result);
                case 16 -> Integer.toHexString(result);
                default -> Integer.toString(result);
            };
            System.out.println("Результат: " + resultStr.toUpperCase());
        }
    }
}
