import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Task } from '../types/Task';
import { TaskItem } from '../components/TaskItem';
import DateTimePicker from '@react-native-community/datetimepicker';

// Navegación entre pantallas
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const HomeScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [reminder, setReminder] = useState<Date | null>(null);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Cargar tareas al iniciar
  useEffect(() => { loadTasks(); }, []);
  useEffect(() => { saveTasks(); }, [tasks]);

  const loadTasks = async () => {
    const json = await AsyncStorage.getItem('@tasks');
    if (json) setTasks(JSON.parse(json));
  };

  const saveTasks = async () => {
    await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
  };

  //  Agrega una nueva tarea con recordatorio opcional
  const addTask = () => {
    if (!newTask || !category) return;

    const task: Task = {
      id: uuid.v4().toString(),
      title: newTask,
      category,
      completed: false,
      reminder: reminder?.toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setCategory('');
    setReminder(null);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('EditTask', { task });
  };

  // Controlador del selector de fecha/hora
  const onChangeDate = (event: any, selectedDate?: Date) => {
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

  /**
   *  Agrupa las tareas por categoría y las ordena:
   * - Tareas dentro de cada categoría: ordenadas por recordatorio más próximo.
   * - Categorías ordenadas por la tarea más cercana de cada grupo.
   */
  const groupedAndSortedTasks = () => {
    const grouped: Record<string, Task[]> = {};

    for (const task of tasks) {
      if (!grouped[task.category]) grouped[task.category] = [];
      grouped[task.category].push(task);
    }

    for (const category in grouped) {
      grouped[category].sort((a, b) => {
        if (!a.reminder) return 1;
        if (!b.reminder) return -1;
        return new Date(a.reminder).getTime() - new Date(b.reminder).getTime();
      });
    }

    return Object.entries(grouped).sort(([, a], [, b]) => {
      const aDate = a[0].reminder ? new Date(a[0].reminder).getTime() : Infinity;
      const bDate = b[0].reminder ? new Date(b[0].reminder).getTime() : Infinity;
      return aDate - bDate;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Gestor de Tareas</Text>

      {/*  Campos para crear tarea */}
      <TextInput
        placeholder="Título de la tarea"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
      />
      <TextInput
        placeholder="Categoría (hogar, estudio, etc.)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <View style={styles.dateTimeButtons}>
        <Button title="📅 Elegir fecha" onPress={() => { setMode('date'); setShowPicker(true); }} />
        <Button title="⏰ Elegir hora" onPress={() => { setMode('time'); setShowPicker(true); }} />
      </View>

      {reminder && (
        <Text style={styles.reminderText}>
          Recordatorio: {reminder.toLocaleString()}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={reminder || new Date()}
          mode={mode}
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Button title="Agregar tarea" onPress={addTask} />

      {/* Tareas agrupadas y ordenadas */}
      {groupedAndSortedTasks().map(([category, tasksInCategory]) => (
        <View key={category}>
          <Text style={styles.categoryHeader}>📁 {category}</Text>
          {tasksInCategory.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onEdit={() => handleEditTask(task)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7f1', // Verde menta suave para productividad
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dateTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reminderText: {
    color: '#00796b',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 20,
    marginBottom: 8,
  },
});







