package pupupu;

import pupupu.beans.ResultStorageBean;
import pupupu.classes.Result;
import pupupu.classes.Validator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;


public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int count = 0;
        while (count != 1) {
            LocalDateTime requestTime = LocalDateTime.now();
            long startTime = System.nanoTime();

            double x = (double) req.getAttribute("x");
            double y = (double) req.getAttribute("y");
            List<Integer> r = (List<Integer>) req.getAttribute("r");
            req.setAttribute("queryLength", r.size());


            if (!Validator.validate(x, y, r)) {
                resp.setContentType("text/plain; charset=UTF-8");
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Некорректные данные запроса");
                break;
            }

            HttpSession session = req.getSession();
            ResultStorageBean resultsBean = (ResultStorageBean) session.getAttribute("resultsBean");

            if (resultsBean == null) {
                resultsBean = new ResultStorageBean();
                session.setAttribute("resultsBean", resultsBean);
            }

            for (int radius : r) {
                boolean hit = isHit(x, y, radius);

                Result result = new Result(x, y, radius, hit, requestTime, System.nanoTime() - startTime);
                resultsBean.addResult(result);
            }

            if (req.getAttribute("graph") != null && (boolean) req.getAttribute("graph")) {
                req.getRequestDispatcher("/index.jsp").forward(req, resp);
                break;
            }

            req.getRequestDispatcher("/result.jsp").forward(req, resp);
            count++;
        }
    }


    private boolean isHit(double x, double y, int r) {
        if (x <= 0) {
            return x >= -r && y >= -r && y <= 0;
        } else if (x <= (float) r / 2) {
            return ((y >= (x / 2 - (float) r / 2)) && (y <= 0)) || ((Math.pow(y, 2) <= Math.pow(((float) r / 2), 2) - Math.pow(x, 2)) && (y >= 0));
        } else if (x <= r) {
            return (y >= (x / 2 - (float) r / 2)) && (y <= 0);
        } else {
            return false;
        }
    }

}
