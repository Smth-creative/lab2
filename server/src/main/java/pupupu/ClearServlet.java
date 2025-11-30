package pupupu;

import pupupu.beans.ResultStorageBean;
import pupupu.classes.Result;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import java.util.List;

public class ClearServlet extends HttpServlet {
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        ResultStorageBean resultsBean = (ResultStorageBean) session.getAttribute("resultsBean");

        if (req.getAttribute("row") != null) {

            int rowIndex = (int) req.getAttribute("row");

            if (rowIndex >= resultsBean.getResults().size() || rowIndex < 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.setContentType("text/plain; charset=UTF-8");

                PrintWriter out = resp.getWriter();
                out.print("Передан некорректный индекс строки истории запросов");
                out.flush();
            } else {
                resultsBean.deleteResult(rowIndex);
                session.setAttribute("resultsBean", resultsBean);

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("text/plain; charset=UTF-8");

                PrintWriter out = resp.getWriter();
                out.print("Операция успешно выполнена");
                out.flush();
            }
        } else {
            List<Result> results = new LinkedList<>();
            resultsBean.setResults(results);
            session.setAttribute("resultsBean", resultsBean);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("text/plain; charset=UTF-8");

            PrintWriter out = resp.getWriter();
            out.print("Операция успешно выполнена");
            out.flush();
        }
    }
}
