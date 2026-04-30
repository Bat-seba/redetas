// *********************************************************************************************************************
//  RUTA: frontend/src/reportWebVitals.js
// 
// 🔹 Este archivo proporciona el mecanismo para medir y analizar el rendimiento de la aplicación web.
// 🔹 Captura las métricas fundamentales (Core Web Vitals) y las envía a un controlador o servicio analítico externo.
// *********************************************************************************************************************

/**
 * @fileoverview Configuración de monitorización de rendimiento (Web Vitals).
 * Carga dinámicamente la biblioteca 'web-vitals' para evaluar la experiencia de usuario y el rendimiento de carga.
 * @author Bat-seba Rodríguez Moreno
 */

/**
 * Registra y emite las métricas vitales de rendimiento de la aplicación.
 * La carga de la librería de evaluación se realiza de forma asíncrona (Dynamic Import / Code Splitting) 
 * para no penalizar el tiempo de compilación y carga inicial del hilo principal.
 * 
 * @param {Function} onPerfEntry - Función de callback que recibirá y procesará los resultados de cada métrica.
 */
const reportWebVitals = onPerfEntry => {
    // Verificación preventiva del tipo y existencia de la función de devolución de llamada
    if (onPerfEntry && onPerfEntry instanceof Function) {
        // Importación asíncrona del módulo de medición
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            // Medición de Cumulative Layout Shift (Desplazamiento de diseño acumulado - Estabilidad visual)
            getCLS(onPerfEntry);
            
            // Medición de First Input Delay (Retraso de la primera entrada - Interactividad)
            getFID(onPerfEntry);
            
            // Medición de First Contentful Paint (Primer despliegue de contenido - Percepción de carga)
            getFCP(onPerfEntry);
            
            // Medición de Largest Contentful Paint (Despliegue del contenido más extenso - Rendimiento de carga)
            getLCP(onPerfEntry);
            
            // Medición de Time to First Byte (Tiempo hasta el primer byte - Velocidad de respuesta del servidor)
            getTTFB(onPerfEntry);
        });
    }
};

export default reportWebVitals;