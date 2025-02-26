"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDateTime = exports.getCurrentWeekRange = void 0;
const getCurrentWeekRange = () => {
    const timeZone = "America/Tijuana";
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(new Date(now).setUTCDate(now.getUTCDate() + diffToMonday));
    startOfWeek.setUTCHours(0, 0, 0, 0);
    const endOfWeek = new Date(new Date(startOfWeek).setUTCDate(startOfWeek.getUTCDate() + 6));
    endOfWeek.setUTCHours(23, 59, 59, 999);
    const startOfWeekTijuana = new Date(startOfWeek.toLocaleString("en-US", { timeZone }));
    const endOfWeekTijuana = new Date(endOfWeek.toLocaleString("en-US", { timeZone }));
    // Formatea la fecha sin milisegundos
    const formatDate = (date) => date.toISOString().replace(/\.000Z$/, "Z");
    return {
        start: formatDate(startOfWeekTijuana),
        end: formatDate(endOfWeekTijuana),
    };
};
exports.getCurrentWeekRange = getCurrentWeekRange;
const getCurrentDateTime = () => {
    const timeZone = "America/Tijuana";
    const now = new Date();
    // Convertir a la zona horaria de Tijuana
    const currentTijuanaTime = new Date(now.toLocaleString("en-US", { timeZone }));
    // Formatear la fecha sin milisegundos
    const formatDate = (date) => date.toISOString().replace(/\.000Z$/, "Z");
    return formatDate(currentTijuanaTime);
};
exports.getCurrentDateTime = getCurrentDateTime;
//# sourceMappingURL=dateFunctions.js.map