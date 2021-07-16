import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { useForm } from 'react-hook-form';

import { RFValue } from 'react-native-responsive-fontsize';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import {
  Container,
  HeaderTitle,
  Form
} from './styles';

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required('O título é obrigatório!'),
  email: Yup.string().email('O e-mail não é válido').required('O e-mail é obrigatório!'),
  password: Yup.string().required('A senha é obrigatória!'),
});

export function RegisterLoginData() {

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm({
    resolver: yupResolver(schema)
  });

  async function handleRegister(formData: FormData) {

    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    };

    // Save data on AsyncStorage
    try {

      const dataKey = '@passmanager:logins';

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newLoginData
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();

    } catch (error) {
      Alert.alert("Erro");
    }
  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

          <Form>
            <Input
              title="Título"
              name="title"
              error={
                errors.title && errors.title.message
              }
              control={control}
              placeholder="Escreva o título aqui"
              autoCapitalize="sentences"
              autoCorrect
            />
            <Input
              title="Email"
              name="email"
              error={
                errors.email && errors.email.message
              }
              control={control}
              placeholder="Escreva o Email aqui"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              title="Senha"
              name="password"
              error={
                errors.password && errors.password.message
              }
              control={control}
              secureTextEntry
              placeholder="Escreva a senha aqui"
            />

            <Button
              style={{
                marginTop: RFValue(26)
              }}
              title="Salvar"
              onPress={handleSubmit(handleRegister)}
            />
          </Form>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}