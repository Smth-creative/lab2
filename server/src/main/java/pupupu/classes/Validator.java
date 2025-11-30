package pupupu.classes;

import java.util.List;

public class Validator {
    private static double maxX = 7.5;
    private static double minX = -7.5;
    private static double maxY = 12.5;
    private static double minY = -12.5;
    private static int minR = 1;
    private static int maxR = 5;


    public static boolean validate(double x, double y, List<Integer> rList) {
        if (x > maxX || x < minX) {
            return false;
        }

        if (y > maxY || y < minY) {
            return false;
        }

        for (int r : rList) {
            if (r > maxR || r < minR) {
                return false;
            }
        }

        return true;
    }
}
