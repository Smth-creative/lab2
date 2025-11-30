package pupupu;

import com.google.gson.JsonParser;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

public class ControllerServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            registerParams(req);
            req.getRequestDispatcher("/area-check").forward(req, resp);
        } catch (RuntimeException e) {
            resp.setContentType("text/plain; charset=UTF-8");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Некорректные данные запроса");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setRowNumber(req);

        req.getRequestDispatcher("/clear").forward(req, resp);
    }

    private void setRowNumber(HttpServletRequest req) throws IOException {
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        String body = sb.toString();

        if (!body.isBlank()) {
            var json = JsonParser.parseString(body).getAsJsonObject();
            req.setAttribute("row", json.get("row").getAsInt());
        }
    }

    private void registerParams(HttpServletRequest req) throws IOException {
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        String body = sb.toString();


        var json = JsonParser.parseString(body).getAsJsonObject();
        req.setAttribute("x", json.get("x").getAsDouble());
        req.setAttribute("y", json.get("y").getAsDouble());

        if (json.get("graph") != null) {
            req.setAttribute("graph", json.get("graph").getAsBoolean());
        }

        var jsonR = json.get("r").getAsJsonArray().asList();
        List<Integer> r = new LinkedList<>();

        for (com.google.gson.JsonElement jsonElement : jsonR) {
            int radius = jsonElement.getAsInt();
            r.add(radius);
        }

        req.setAttribute("r", r);
    }


}
