import { evaluate } from 'mathjs';

/**
 * Solves an ODE dy/dx = f(x, y) using the 4th Order Runge-Kutta method.
 * Provides detailed intermediate values for manual calculation steps.
 */
export const solveRK4Detailed = (expression, x0, y0, h, xTarget) => {
    const steps = [];
    let x = x0;
    let y = y0;

    // Initial state
    steps.push({
        step: 0,
        x,
        y,
        k1: null,
        k2: null,
        k3: null,
        k4: null,
        formula: null
    });

    const f = (xVal, yVal) => {
        try {
            return evaluate(expression, { x: xVal, y: yVal });
        } catch (error) {
            return NaN;
        }
    };

    let currentStep = 1;
    while (x < xTarget) {
        if (x + h > xTarget) h = xTarget - x;

        const k1 = h * f(x, y);
        const k2 = h * f(x + h / 2, y + k1 / 2);
        const k3 = h * f(x + h / 2, y + k2 / 2);
        const k4 = h * f(x + h, y + k3);

        const deltaY = (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        const nextY = y + deltaY;
        const nextX = x + h;

        steps.push({
            step: currentStep,
            x: nextX,
            y: nextY,
            prevX: x,
            prevY: y,
            h,
            k1,
            k2,
            k3,
            k4,
            calculations: {
                k1: `${h} * f(${x.toFixed(4)}, ${y.toFixed(4)})`,
                k2: `${h} * f(${(x + h / 2).toFixed(4)}, ${(y + k1 / 2).toFixed(4)})`,
                k3: `${h} * f(${(x + h / 2).toFixed(4)}, ${(y + k2 / 2).toFixed(4)})`,
                k4: `${h} * f(${(x + h).toFixed(4)}, ${(y + k3).toFixed(4)})`,
                yNext: `${y.toFixed(4)} + (1/6) * (${k1.toFixed(4)} + 2*${k2.toFixed(4)} + 2*${k3.toFixed(4)} + ${k4.toFixed(4)})`
            },
            substitutions: {
                k1: `k1 = h * f(x_n, y_n) = ${h} * f(${x.toFixed(2)}, ${y.toFixed(2)})`,
                k2: `k2 = h * f(x_n + h/2, y_n + k1/2) = ${h} * f(${(x + h / 2).toFixed(2)}, ${(y + k1 / 2).toFixed(2)})`,
                k3: `k3 = h * f(x_n + h/2, y_n + k2/2) = ${h} * f(${(x + h / 2).toFixed(2)}, ${(y + k2 / 2).toFixed(2)})`,
                k4: `k4 = h * f(x_n + h, y_n + k3) = ${h} * f(${(x + h).toFixed(2)}, ${(y + k3).toFixed(2)})`
            }
        });

        y = nextY;
        x = nextX;
        currentStep++;

        if (currentStep > 500) break; // Infinite loop safety
    }

    return steps;
};
