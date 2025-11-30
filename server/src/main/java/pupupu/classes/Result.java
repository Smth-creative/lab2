package pupupu.classes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Result {
    private double x;
    private double y;
    private int r;
    private boolean hit;
    private long calcTime;
    private LocalDateTime startTime;

    public Result(double x, double y, int r, boolean hit, LocalDateTime startTime,  long calcTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;

        this.startTime = startTime;
        this.calcTime = calcTime;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public boolean getHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public long getCalcTime() {
        return calcTime;
    }

    public void setCalcTime(long calcTime) {
        this.calcTime = calcTime;
    }

    public String getStartTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return startTime.format(formatter);
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}
