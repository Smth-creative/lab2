<%@page contentType="text/html; charset=UTF-8" session="false" %>
<%@ page import="pupupu.classes.Result" %>
<%@ page import="pupupu.beans.ResultStorageBean" %>
<%@ page import="javax.servlet.http.HttpSession" %>
<%@ page import="java.util.List" %>
<%@ page import="java.time.LocalDateTime" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>lab1</title>

    <link rel="stylesheet" href="static/result.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=LXGW+WenKai+TC&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
</head>
<body>
<center>
    <header>
        <h1>Быков Тимур Антонович</h1>
        <h3>Группа: Р3220</h3>
        <h3>Вариант: 23458</h3>
    </header>

    <button type="button" id="redirect">верните меня пж</button>

    <table id="result_table">
        <tr>
            <th>x</th>
            <th>y</th>
            <th>r</th>
            <th>результат</th>
            <th>время запроса</th>
            <th>время выполнения</th>
        </tr>
    <%
        HttpSession currentSession = request.getSession();
        ResultStorageBean resultsBean = (ResultStorageBean) currentSession.getAttribute("resultsBean");
        List<Result> results = resultsBean.getResults();
        int queryLength = (int) request.getAttribute("queryLength");

        for (int i = 0; i < queryLength; i++) {
            Result result = results.get(i);
    %>

        <tr>
            <th><%= result.getX() %></th>
            <th><%= result.getY() %></th>
            <th><%= result.getR() %></th>
            <th><%= result.getHit() %></th>
            <th><%= result.getStartTime() %></th>
            <th><%= Long.toString(result.getCalcTime()).substring(0, 2) + "ms" %></th>
        </tr>
    <%
        }
    %>
                </table>
</center>
</body>


<script>
    document.querySelector("button").addEventListener("click", function () {
        window.location.replace("http://localhost:20010/server");
    })
</script>


</html>