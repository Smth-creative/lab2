import {validateValues} from './validator.js';

let resultBody = document.getElementById('result_table');
const error = document.getElementById('error');

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

var clicked_radius = [], x, y;

const dwarf = document.getElementById('dwarf');
let dwarf_position, dwarf_direction;
dwarf.src = "static/blank.png"
dwarf.style.width = "1px";
dwarf.style.height = "1px";
const dwarf_width = 300;
const dwarf_height = 231;

let reset_timeout, animation_timeout;
const reset_time = 6000;
const dwarf_animation_time = 21000;

const siren = new Audio("static/social-credit-siren.mp3");
let current_rows = []; // [1, 2, 3, ...], потому что нулевая - это заголовок

function stealResult(row_number) {
    let request = new Map();
    request.set('row', current_rows.indexOf(row_number));

    fetch("http://localhost:20010/server/controller", {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(Object.fromEntries(request))
    }).then(response => {
        if (response.ok) {
            resultBody.children[0].children[row_number].outerHTML = '' +
                    '<tr>' +
                    '<td colspan="6" style="color: red">' +
                    'дворф похитил этот результат из вашей истории(' +
                    '</td>' +
                    '</tr>';
            const index = current_rows.indexOf(row_number);
            current_rows.splice(index, 1);

            if (current_rows.length > 0) {
                if (current_rows.length === 0) {
                    current_rows = [1];
                }
                setTimeout(resetDwarf, reset_time);

            }
        } else {
            response.text().then(text => {
                error.innerText = text;
            });
        }

    }).catch((bug) => {
        error.innerText = "Сорри, у вас на клиенте ошибка какая-то, перезапустить попробуйте";
        console.error(bug);
    });
}


function resetDwarf() {
    clearTimeout(reset_timeout);
    dwarf_position = 0;
    dwarf_direction = 8;
    dwarf.style.transform = 'scale(1, 1)';

    dwarf.src = "static/dwarf.gif";
    dwarf.style.width = dwarf_width + "px";
    dwarf.style.height = dwarf_height + "px";
    reset_timeout = setTimeout(() => {
        dwarf.src = "static/boom.gif"
        dwarf_direction = 0;

        setTimeout(() => {
            dwarf.src = "static/sad.gif"
            setTimeout(() => {
                stopAnimation();

                let row_number = current_rows[Math.floor(Math.random() * current_rows.length)]
                stealResult(row_number);

            }, 1500);
        }, 1000);
    }, dwarf_animation_time);

    siren.play();
    siren.loop = true;
    animateDwarf();
}


function animateDwarf() {
    if (dwarf_position + dwarf.width >= window.screen.width) {
        dwarf.style.transform = 'scale(-1, 1)';
        dwarf_direction *= -1;
    }

    if (dwarf_position < 0) {
        dwarf.style.transform = 'scale(1, 1)';
        dwarf_direction *= -1;
    }

    dwarf_position += dwarf_direction;
    dwarf.style.left = dwarf_position + 'px';

    animation_timeout = setTimeout(animateDwarf, 40);
}


function stopAnimation() {
    siren.pause();
    clearTimeout(reset_timeout);
    clearTimeout(animation_timeout);

    dwarf.src = "static/blank.png"
    dwarf.style.width = "1px";
    dwarf.style.height = "1px";
}

dwarf.addEventListener('click', () => {
    dwarf.src = "static/boom.gif"
    dwarf_direction = 0;
    setTimeout(() => {
        stopAnimation();
        setTimeout(resetDwarf, reset_time);
    }, 1000);
});

renderLastRequest();

document.getElementById('submit_btn').addEventListener('click', function () {
    x = document.forms[0].elements["x"];
    y = document.getElementById('y');
    send(x, y);
});


function send(abscissa, ordinate) {
    const r_inputs = document.querySelectorAll("input[type='checkbox']:checked");

    if (validateValues(abscissa, ordinate, r_inputs)) {
        let r_values = [];
        r_inputs.forEach(r => r_values.push(r.value));

        const request = new Map();

        if (abscissa.value !== undefined && ordinate.value !== undefined) {
            request.set('x', abscissa.value);
            request.set('y', ordinate.value);
        } else {
            request.set('x', abscissa);
            request.set('y', ordinate);
            request.set('graph', true);
        }
        request.set('r', r_values);

        fetch("http://localhost:20010/server/controller", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(Object.fromEntries(request)),
        }).then(response => {
            response.text().then(html => {
                if (response.ok) {
                    stopAnimation();

                    if (request.get('graph')) {
                        const doc = new DOMParser().parseFromString(html, "text/html");
                        const new_table = doc.getElementById("result_table");
                        document.getElementById("result_table").replaceWith(new_table);
                        resultBody = document.getElementById("result_table");
                        drawChosenPoints(clicked_radius);
                    } else {
                        document.open();
                        document.write(html);
                        document.close();
                    }
                } else {
                    error.innerText = html;
                }
            });
        }).catch((bug) => {
            error.innerText = "Сорри, у вас на клиенте ошибка какая-то, перезапустить попробуйте";
            console.error(bug)
        });
    }
}

document.getElementById('clear_btn').addEventListener('click', function () {
    fetch("http://localhost:20010/server/controller", {
        method: 'DELETE'
    }).then(() => {
        resultBody.innerHTML = `
        <tr>
            <th>x</th>
            <th>y</th>
            <th>r</th>
            <th>результат</th>
            <th>время запроса</th>
            <th>время выполнения</th>
        </tr>
        `;
        drawGraph();

        dwarf.src = "static/boom.gif"
        dwarf_direction = 0;
        setTimeout(stopAnimation, 1000);
    }).catch((bug) => {
        error.innerText = "Сорри, у вас на клиенте ошибка какая-то, перезапустить попробуйте";
        console.error(bug)
    })

});

document.querySelectorAll("input[type='checkbox']").forEach(
        checkbox => checkbox.addEventListener("change", registerRadius)
);


function registerRadius(event) {
    const checkbox = event.target;

    if (checkbox.checked) {
        clicked_radius.push(checkbox.value);
    } else {
        let index = clicked_radius.indexOf(checkbox.value);

        if (index !== -1) {
            clicked_radius.splice(index, 1);
        }
    }

    if (clicked_radius.length > 0) {
        canvas.classList.add('cursor_on');
    } else {
        canvas.classList.remove('cursor_on');
    }
    drawGraph();
    drawChosenPoints(clicked_radius);
}


function drawPoint(x, y, isHit = null) {
    ctx.beginPath();
    switch (x) {
        case 0:
            ctx.arc(x + width / 100, y, 3, 0, 2 * Math.PI);
            break;
        case width:
            ctx.arc(x - width / 100, y, 3, 0, 2 * Math.PI);
            break;
        default:
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
    }
    if (isHit === null) {
        ctx.fillStyle = `rgb(186, 85, 211)`;
    } else if (isHit === 'true' || isHit === true) {
        ctx.fillStyle = 'green';
    } else if (isHit === 'false' || isHit === false) {
        ctx.fillStyle = 'red';
    } else {
        ctx.fillStyle = `rgb(186, 85, 211)`;
    }

    ctx.fill();
}


function drawChosenPoints(chosen_radius) {
    const center_x = width / 2, center_y = height / 2;
    const graph_size = width / 3;
    const rows = resultBody.children[0].children;

    if (rows.length === 1) {
        return;
    }

    const rows_array = Array.from(rows).splice(1, rows.length - 1);
    rows_array.reverse();

    let points = [];
    let max_r = 0;

    rows_array.forEach(row => {
        const columns = row.children;
        if (columns[0].innerText !== 'дворф похитил этот результат из вашей истории(') {
            const current_r = columns[2].innerText;

            if (parseInt(current_r) > max_r && chosen_radius.includes(current_r)) max_r = parseInt(current_r);
        }

    });

    rows_array.forEach(row => {
        const columns = row.children;
        if (columns[0].innerText !== 'дворф похитил этот результат из вашей истории(') {

            if (chosen_radius.includes(columns[2].innerText)) {
                const x = parseFloat(columns[0].innerText);
                const y = parseFloat(columns[1].innerText);
                points.push([x, y, columns[3].innerText]);

                points.forEach(result => {
                    const xpx = center_x + (result[0] / max_r) * graph_size;
                    const ypx = center_y - (result[1] / max_r) * graph_size;
                    drawPoint(xpx, ypx, result[2]);
                })
            }
        }
    })
}


function drawGraph(chosen_radius = clicked_radius) {
    const center_x = width / 2;
    const center_y = height / 2;
    const graph_size = width / 3; // Радиус на рисунке
    ctx.clearRect(0, 0, width, height);
    ctx.font = '16px arial';

    if (chosen_radius === undefined || chosen_radius.length === 0) {
        drawSubgraph([1], center_x, center_y, graph_size, false);
        return;
    }

    chosen_radius.sort();
    drawSubgraph(chosen_radius, center_x, center_y, graph_size);
}


function drawSubgraph(rads, center_x, center_y, standard_graph_size, anyResults = true) {
    const biggest_rad = rads[rads.length - 1];
    const indent = width / 100;
    const colors = [
        `rgba(179, 221, 255, 0.4)`, `rgba(51, 153, 255, 0.2)`, `rgba(0, 119, 204, 0.2)`,
        `rgba(0, 85, 170, 0.2)`, `rgba(0, 51, 102, 0.05)`
    ];

    for (let i = 0; i < rads.length; i++) {
        let rad = rads[i];
        const graph_size = standard_graph_size * (rad / rads[rads.length - 1]);

        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.fillStyle = colors[i];
        ctx.rect(center_x - graph_size, center_y, graph_size, graph_size);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.arc(center_x, center_y, graph_size / 2, 3 * Math.PI / 2, 2 * Math.PI, false);
        ctx.lineTo(center_x, center_y);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.moveTo(center_x, center_y);
        ctx.lineTo(center_x + graph_size, center_y);
        ctx.lineTo(center_x, center_y + graph_size / 2);
        ctx.fill();
        ctx.stroke();

    }

    ctx.beginPath();
    ctx.strokeStyle = 'black';

    if (anyResults) {
        ctx.strokeText((biggest_rad / 2).toString(), center_x + standard_graph_size / 2 - indent, center_y - indent);
        ctx.strokeText(biggest_rad.toString(), center_x + standard_graph_size - indent, center_y - indent);

        ctx.strokeText((-biggest_rad / 2).toString(), center_x - standard_graph_size / 2 - indent, center_y - indent);
        ctx.strokeText((-biggest_rad).toString(), center_x - standard_graph_size - indent, center_y - indent);

        ctx.strokeText((biggest_rad / 2).toString(), center_x + indent, center_y - standard_graph_size / 2 + indent);
        ctx.strokeText(biggest_rad.toString(), center_x + indent, center_y - standard_graph_size + indent);

        ctx.strokeText((-biggest_rad / 2).toString(), center_x + indent, center_y + standard_graph_size / 2 + indent);
        ctx.strokeText((-biggest_rad).toString(), center_x + indent, center_y + standard_graph_size + indent);
    } else {
        ctx.strokeText("R/2", center_x + standard_graph_size / 2 - indent, center_y - indent);
        ctx.strokeText("R", center_x + standard_graph_size - indent, center_y - indent);

        ctx.strokeText("-R/2", center_x - standard_graph_size / 2 - indent, center_y - indent);
        ctx.strokeText("-R", center_x - standard_graph_size - indent, center_y - indent);

        ctx.strokeText("R/2", center_x + indent, center_y - standard_graph_size / 2 + indent);
        ctx.strokeText("R", center_x + indent, center_y - standard_graph_size + indent);

        ctx.strokeText("-R/2", center_x + indent, center_y + standard_graph_size / 2 + indent);
        ctx.strokeText("-R", center_x + indent, center_y + standard_graph_size + indent);
    }

    // Ox, Oy
    ctx.beginPath();
    ctx.strokeStyle = 'black';

    ctx.moveTo(center_x, center_y - 1.5 * standard_graph_size);
    ctx.lineTo(center_x, center_y + 1.5 * standard_graph_size);

    ctx.moveTo(center_x - 1.5 * standard_graph_size, center_y);
    ctx.lineTo(center_x + 1.5 * standard_graph_size, center_y);

    ctx.stroke();
}


canvas.addEventListener('mousedown', (click) => {
    const chosen_radius = clicked_radius;
    let bounding = canvas.getBoundingClientRect();
    let clicked_x = click.clientX - bounding.left;
    let clicked_y = click.clientY - bounding.top;
    drawGraph();

    switch (chosen_radius.length) {
        case 0: {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '20px Overpass';
            ctx.strokeStyle = 'red';
            ctx.strokeText("Выберите радиус хотя бы", width / 3.25, height / 2);
            ctx.strokeText("чё вы блин", width / 2.4, height / 1.75);
            break;
        }
        default: {
            const center_x = width / 2, center_y = height / 2;
            const graph_size = width / 3;
            const r = chosen_radius[chosen_radius.length - 1];

            // normalised x
            const nx = (clicked_x - center_x) / graph_size;
            const ny = -(clicked_y - center_y) / graph_size;

            x = nx * r;
            y = ny * r;

            const xpx = center_x + (x / r) * graph_size;
            const ypx = center_y - (y / r) * graph_size;

            drawPoint(xpx, ypx);

            send(x, y);
            break;
        }
    }
});


function activateCheckbox(radius) {
    document.querySelectorAll("input[type='checkbox']")[radius - 1].checked = true;
    clicked_radius.push(radius.toString());
    canvas.classList.add('cursor_on')
}

function renderLastRequest() {
    const rows = resultBody.children[0].children;
    const last_requests = extractLastRequest(rows);

    if (last_requests.length === 0) {
        drawGraph();
        return;
    }

    let last_radius = [];
    Array.from(last_requests).forEach(row => {
        last_radius.unshift(row.children[2].innerText);
        activateCheckbox(parseInt(row.children[2].innerText));
    })

    const row = last_requests[0];
    const x = row.children[0].innerText, y = row.children[1].innerText;

    drawGraph(last_radius);

    const center_x = width / 2, center_y = height / 2;
    const graph_size = width / 3;
    const r = last_radius[last_radius.length - 1];

    const xpx = center_x + (x / r) * graph_size;
    const ypx = center_y - (y / r) * graph_size;

    const hit = row.children[3].innerText;

    if ((hit !== 'true') && (hit !== 'false')) {
        drawPoint(xpx, ypx);
        reset_timeout = setTimeout(resetDwarf, reset_time);
        return;
    }

    // drawPoint(xpx, ypx, hit);
    drawChosenPoints(clicked_radius);
    reset_timeout = setTimeout(resetDwarf, reset_time);
}


function extractLastRequest(rows) {
    let last_request_time = null;
    let last_request = [];

    if (rows.length === 1) {
        return last_request;
    }

    const rows_array = Array.from(rows);

    for (let i = 1; i < rows_array.length; i++) {
        current_rows.push(i);
    }

    for (let i = 1; i < rows_array.length; i++) {
        const row = rows_array[i];
        const columns = row.children;
        const request_time = columns[4].innerText;

        if (last_request_time === null) {
            last_request_time = request_time;
            last_request.push(row);

            if (i === rows_array.length - 1) {
                return last_request;
            }

        } else if (last_request_time === request_time) {
            last_request.push(row);

            if (i === rows_array.length - 1) {
                return last_request;
            }

        } else {
            return last_request;
        }
    }
}