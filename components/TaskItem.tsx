/**
 * Componente funcional que representa una tarea individual dentro de una lista.
 * Muestra el título, la categoría, el recordatorio (si existe),
 * un botón para marcar como completada y otro para editar la tarea.
 * 
 * Usa emojis para representar el checkbox de forma personalizada, sin librerías externas.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task } from '../types/Task';

// Tipado de las propiedades que recibe el componente
interface Props {
  task: Task; // Objeto con los datos de la tarea
  onToggleComplete: (id: string) => void; // Función que marca como completada o no completada
  onEdit: () => void; // Función que navega a la pantalla de edición de la tarea
}

/**
 * Componente TaskItem: representa una tarjeta visual para cada tarea en la lista.
 * Incluye título, categoría, recordatorio, checkbox personalizado y botón de edición.
 */
export const TaskItem: React.FC<Props> = ({ task, onToggleComplete, onEdit }) => {
  return (
    <View style={styles.item}>
      
      {/*  Checkbox personalizado que alterna el estado de completado */}
      <Pressable onPress={() => onToggleComplete(task.id)} style={styles.checkbox}>
        <Text style={{ fontSize: 18 }}>
          {task.completed ? '✅' : '⬜'}
        </Text>
      </Pressable>

      {/*  Información de la tarea: título, categoría y recordatorio si existe */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.category}>📁 {task.category}</Text>
        {task.reminder && (
          <Text style={styles.reminder}>⏰ {new Date(task.reminder).toLocaleString()}</Text>
        )}
      </View>

      {/*  Botón que lanza la navegación hacia la pantalla de edición */}
      <Pressable onPress={onEdit} style={styles.editButton}>
        <Text style={styles.editText}>✏️</Text>
      </Pressable>
    </View>
  );
};

//  Estilos del componente TaskItem
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  reminder: {
    fontSize: 12,
    color: '#00796b',
  },
  editButton: {
    padding: 6,
  },
  editText: {
    fontSize: 18,
  },
});












