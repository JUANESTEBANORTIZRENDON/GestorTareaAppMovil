import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//  Importa las pantallas
import { HomeScreen } from '../screens/HomeScreen';
import { EditTaskScreen } from '../screens/EditTaskScreen';

//  Importa el tipo Task para pasarlo como parámetro entre pantallas
import { Task } from '../types/Task';

//  Define los tipos de parámetros que se le pueden pasar a cada pantalla
export type RootStackParamList = {
  Home: undefined;
  EditTask: { task: Task };
};

//  Crea el stack navigator con los tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

// Configura el contenedor de navegación
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gestor de Tareas',animation: 'slide_from_left', }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Editar Tarea',animation: 'slide_from_right', }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
