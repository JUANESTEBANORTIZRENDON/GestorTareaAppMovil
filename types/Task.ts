export type Task = {
    id: string;
    title: string;
    category: string;
    completed: boolean;
    reminder?: string; // ISO format para que lo envie a la hora de modificarlo 
  };
  /**
 * Representa una tarea en el sistema de gestión de tareas.
 * Este tipo es utilizado en todo el proyecto para mantener
 * el tipado fuerte y coherente de los objetos de tipo "tarea".
 */
  