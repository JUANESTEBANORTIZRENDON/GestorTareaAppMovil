/**
 * Pantalla de edición de una tarea existente.
 * Permite modificar título, categoría, fecha y hora del recordatorio.
 * También permite eliminar la tarea o volver a la pantalla principal (HomeScreen).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  Alert
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

// Tipado para navegación y parámetros recibidos
type EditTaskRouteProp = RouteProp<RootStackParamList, 'EditTask'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EditTaskScreen = () => {
  const route = useRoute<EditTaskRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const taskToEdit = route.params.task;

  // Estados para edición
  const [title, setTitle] = useState(taskToEdit.title);
  const [category, setCategory] = useState(taskToEdit.category);
  const [reminder, setReminder] = useState<Date | null>(
    taskToEdit.reminder ? new Date(taskToEdit.reminder) : null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  //  Actualizar tarea en AsyncStorage
  const updateTask = async () => {
    const json = await AsyncStorage.getItem('@tasks');
    if (!json) return;

    const tasks: Task[] = JSON.parse(json);
    const updatedTasks = tasks.map(t =>
      t.id === taskToEdit.id
        ? {
            ...t,
            title,
            category,
            reminder: reminder ? reminder.toISOString() : null,
          }
        : t
    );

    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    navigation.goBack(); // 🔁 Regresa al HomeScreen
  };

  // eliminar tarea con confirmación
  const deleteTask = async () => {
    Alert.alert('Confirmar', '¿Estás seguro de que deseas eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const json = await AsyncStorage.getItem('@tasks');
          if (!json) return;

          const tasks: Task[] = JSON.parse(json);
          const updatedTasks = tasks.filter(t => t.id !== taskToEdit.id);

          await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
          navigation.goBack();
        }
      }
    ]);
  };

  // Manejar cambios en fecha/hora
  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);

    if (selectedDate) {
      setReminder(prev =>
        mode === 'date'
          ? new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              prev?.getHours() ?? 0,
              prev?.getMinutes() ?? 0
            )
          : new Date(
              prev?.getFullYear() ?? new Date().getFullYear(),
              prev?.getMonth() ?? new Date().getMonth(),
              prev?.getDate() ?? new Date().getDate(),
              selectedDate.getHours(),
              selectedDate.getMinutes()
            )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar Tarea</Text>

      {/* Campos de edición */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        style={styles.input}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Categoría"
        style={styles.input}
      />

      {/* Botones para seleccionar fecha y hora */}
      <View style={styles.buttonRow}>
        <Button title="📅 Cambiar Fecha" onPress={() => { setMode('date'); setShowPicker(true); }} color="#388e3c" />
        <Button title="⏰ Cambiar Hora" onPress={() => { setMode('time'); setShowPicker(true); }} color="#00796b" />
      </View>

      {/* Vista previa del recordatorio */}
      {reminder && (
        <Text style={styles.reminder}>Recordatorio: {reminder.toLocaleString()}</Text>
      )}

      {/* Selector de fecha u hora */}
      {showPicker && (
        <DateTimePicker
          value={reminder || new Date()}
          mode={mode}
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Botones de acción */}
      <View style={styles.buttonGroup}>
        <Button title="💾 Guardar cambios" onPress={updateTask} color="#388e3c" />
        <Button title="🗑️ Eliminar tarea" onPress={deleteTask} color="#f28b82" />
        <Button title="⬅️ Volver" onPress={() => navigation.goBack()} color="#90a4ae" />
      </View>
    </View>
  );
};

// Estilos adaptados al fondo verde menta
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e0f7f1' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2c3e50'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  reminder: {
    fontSize: 12,
    textAlign: 'center',
    color: '#00796b',
    marginBottom: 10
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10
  }
});

  
