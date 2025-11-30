export function validateValues(x, y, r_values) {
    if (x.value === undefined && y.value === undefined && r_values.length > 0) {
        error.innerText = '';
        return true;
    }

    if (x === null || x.value === '') {
        error.innerText = 'Введите x';
        throw new Error("x doesn't have a value");
    }

    if (isNaN(x.value) || x.value < -2 || x.value > 2) {
        error.innerText = 'Введите корректный x (от -4 до 4)';
        throw new Error('Invalid x value');
    }


    if (y === null || y.value === '') {
        error.innerText = 'Введите y';
        throw new Error("y doesn't have a value");
    }

    if (isNaN(y.value) || y.value < -3 || y.value > 3) {
        error.innerText = 'Введите корректный y (от -3 до 3)';
        throw new Error('Invalid y value');
    }


    if (r_values === null || r_values.length === 0) {
        error.innerText = 'Введите r';
        throw new Error("r doesn't have a value");
    }

    r_values.forEach(r => {
        if (isNaN(r.value) || Number.isInteger(r.value) || r < 1 || r > 5) {
            error.innerText = 'Введите корректный r (от 2 до 5)';
            throw new Error('Invalid r value');
        }
    })

    error.innerText = '';
    return true;
}