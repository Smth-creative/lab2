<%@page contentType="text/html; charset=UTF-8" session="false" %>
<%@ page import="pupupu.classes.Result" %>
<%@ page import="pupupu.beans.ResultStorageBean" %>
<%@ page import="javax.servlet.http.HttpSession" %>
<%@ page import="java.util.List" %>
<%@ page import="java.time.LocalDateTime" %>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8" http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <title>lab1</title>
    <script type="module" src="static/main.js" defer></script>

    <link rel="stylesheet" href="static/style.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=LXGW+WenKai+TC&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Murecho:wght@100..900&display=swap" rel="stylesheet">
</head>

<body>

<div id="top">
    <center>
        <header>
            <h1>Быков Тимур Антонович</h1>
            <h3>Группа: Р3220</h3>
            <h3>Вариант: 23458</h3>
        </header>
    </center>
</div>

<img src="static/blank.png" id="dwarf">

<div class="content">
    <div class="left-section">
        <div class="form-wrapper">
            <form id="values_form">
                <fieldset>
                    <label>x: </label>
                    <input type="radio" id="x1" name="x" value="-2">
                    <label for="x1">-2</label>

                    <input type="radio" id="x2" name="x" value="-1.5">
                    <label for="x2">-1.5</label>

                    <input type="radio" id="x3" name="x" value="-1">
                    <label for="x3">-1</label>

                    <input type="radio" id="x4" name="x" value="-0.5">
                    <label for="x4">-0.5</label>

                    <input type="radio" id="x5" name="x" value="0">
                    <label for="x5">0</label>

                    <input type="radio" id="x6" name="x" value="0.5">
                    <label for="x6">0.5</label>

                    <input type="radio" id="x7" name="x" value="1">
                    <label for="x7">1</label>

                    <input type="radio" id="x8" name="x" value="1.5">
                    <label for="x8">1.5</label>

                    <input type="radio" id="x9" name="x" value="2">
                    <label for="x9">2</label>

                </fieldset>

                <label for="y">y:</label>
                <input type="number" step="0.001" id="y" min="-3" max="3" placeholder="от -3 до 3"/>

                <fieldset>
                    <label>r: </label>

                    <input type="checkbox" id="r1" name="r" value="1">
                    <label for="r1">1</label>

                    <input type="checkbox" id="r2" name="r" value="2">
                    <label for="r2">2</label>

                    <input type="checkbox" id="r3" name="r" value="3">
                    <label for="r3">3</label>

                    <input type="checkbox" id="r4" name="r" value="4">
                    <label for="r4">4</label>

                    <input type="checkbox" id="r5" name="r" value="5">
                    <label for="r5">5</label>
                </fieldset>

                <button type="button" id="submit_btn">отправить</button>
                <button type="button" id="clear_btn">очистить таблицу</button>
            </form>

            <div id="error"></div>

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
                    HttpSession currentSession = request.getSession(false);

                    if (currentSession != null) {
                        ResultStorageBean resultsBean = (ResultStorageBean) currentSession.getAttribute("resultsBean");
                        List<Result> results = resultsBean.getResults();
                        for (Result result : results) {
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
                    }
                %>
            </table>
        </div>
    </div>


    <div class="right-section">
        <canvas id="graph" width="600" height="600"></canvas>
    </div>
</div>
</body>
</html>